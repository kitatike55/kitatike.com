import { copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildSite } from "./render-site.mjs";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(projectDir, "content", "site.json");
const localEnvPath = path.join(projectDir, ".env");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const source = readFileSync(filePath, "utf8");
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function objectSchema(properties) {
  return {
    type: "object",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  };
}

const siteSchema = objectSchema({
  meta: objectSchema({
    title: { type: "string" },
    description: { type: "string" },
    ogDescription: { type: "string" },
  }),
  profile: objectSchema({
    name: { type: "string" },
    nameJa: { type: "string" },
    position: { type: "string" },
    affiliations: { type: "array", items: { type: "string" } },
    email: { type: "string" },
  }),
  educationExperience: {
    type: "array",
    items: objectSchema({
      period: { type: "string" },
      organization: { type: "string" },
      detail: { type: "string" },
    }),
  },
  researchThemes: {
    type: "array",
    items: objectSchema({
      name: { type: "string" },
      topics: { type: "array", items: { type: "string" } },
    }),
  },
  scholarships: {
    type: "array",
    items: objectSchema({
      period: { type: "string" },
      name: { type: "string" },
    }),
  },
  publicationsDescription: { type: "string" },
  links: {
    type: "array",
    items: objectSchema({
      label: { type: "string" },
      url: { type: "string" },
    }),
  },
});

function validateSite(site) {
  const fail = (message) => {
    throw new Error(`Invalid site data: ${message}`);
  };
  if (!site || typeof site !== "object" || Array.isArray(site)) fail("root must be an object");
  for (const key of Object.keys(siteSchema.properties)) {
    if (!(key in site)) fail(`missing ${key}`);
  }
  if (!site.profile.email.includes("@")) fail("email is invalid");
  for (const link of site.links) {
    if (!String(link.url).startsWith("https://")) fail(`link must use HTTPS: ${link.url}`);
  }
  const serialized = JSON.stringify(site);
  if (serialized.includes("<script") || serialized.includes("javascript:")) {
    fail("scripts are not allowed");
  }
}

function extractOutputText(response) {
  for (const output of response.output ?? []) {
    if (output.type !== "message") continue;
    for (const content of output.content ?? []) {
      if (content.type === "refusal") throw new Error(`The API refused the request: ${content.refusal}`);
      if (content.type === "output_text") return content.text;
    }
  }
  throw new Error("The API returned no structured output.");
}

function timestamp() {
  return new Date().toISOString().replaceAll(":", "-").replace(/\.\d{3}Z$/, "Z");
}

async function readDropboxFile(filePath, attempts = 20) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await readFile(filePath, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT" || attempt === attempts) throw error;
      if (attempt === 1) console.log(`Waiting for Dropbox to download ${filePath}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

loadEnvFile(localEnvPath);

const dropboxDir = process.env.SITE_UPDATE_DROPBOX_DIR;
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
const applyMode = process.argv.includes("--apply");

if (!dropboxDir) throw new Error("SITE_UPDATE_DROPBOX_DIR is not set.");

const inboxDir = path.join(dropboxDir, "inbox");
const previewDir = path.join(dropboxDir, "preview");
const completedDir = path.join(dropboxDir, "completed");
const errorDir = path.join(dropboxDir, "error");
const requestPath = path.join(inboxDir, "request.md");
const proposalPath = path.join(previewDir, "proposed-site.json");
const summaryPath = path.join(previewDir, "summary.md");

await Promise.all([
  mkdir(inboxDir, { recursive: true }),
  mkdir(previewDir, { recursive: true }),
  mkdir(completedDir, { recursive: true }),
  mkdir(errorDir, { recursive: true }),
]);

try {
  if (applyMode) {
    const proposal = JSON.parse(await readDropboxFile(proposalPath));
    validateSite(proposal.site);
    await copyFile(contentPath, path.join(previewDir, "previous-site.json"));
    await writeFile(contentPath, `${JSON.stringify(proposal.site, null, 2)}\n`, "utf8");
    await buildSite();
    if (existsSync(requestPath)) {
      await rename(requestPath, path.join(completedDir, `${timestamp()}-request.md`));
    }
    console.log("Applied the preview and regenerated index.html.");
    console.log("Next: review the changes with git diff.");
  } else {
    if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");
    if (!existsSync(requestPath)) {
      await writeFile(
        requestPath,
        "# サイト更新依頼\n\nここに変更したい内容を書いてください。\n",
        "utf8",
      );
      console.log(`Created ${requestPath}`);
      console.log("Write the request, then run this command again.");
      process.exit(0);
    }

    const request = (await readDropboxFile(requestPath)).trim();
    if (!request || request === "# サイト更新依頼\n\nここに変更したい内容を書いてください。") {
      if (!request) {
        await writeFile(
          requestPath,
          "# サイト更新依頼\n\nここに変更したい内容を書いてください。\n",
          "utf8",
        );
      }
      console.log("request.md is ready. Write the requested change, then run this command again.");
      process.exit(0);
    }

    const currentSite = JSON.parse(await readDropboxFile(contentPath));
    validateSite(currentSite);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        store: false,
        instructions:
          "You update a small academic personal website. Apply only the user's explicit request. Preserve all unspecified facts, wording, ordering, URLs, and structure exactly. Never invent achievements, affiliations, dates, publications, links, or contact details. Return a concise Japanese summary and the complete updated site object.",
        input: `Current site data:\n${JSON.stringify(currentSite, null, 2)}\n\nUser request:\n${request}`,
        text: {
          format: {
            type: "json_schema",
            name: "site_update",
            strict: true,
            schema: objectSchema({
              summary: { type: "string" },
              site: siteSchema,
            }),
          },
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${body.slice(0, 800)}`);
    }

    const proposal = JSON.parse(extractOutputText(await response.json()));
    validateSite(proposal.site);
    await writeFile(proposalPath, `${JSON.stringify(proposal, null, 2)}\n`, "utf8");
    await writeFile(
      summaryPath,
      `# 更新案\n\n${proposal.summary}\n\nまだサイトには適用されていません。\n`,
      "utf8",
    );
    console.log("Created a preview. No site files were changed.");
    console.log(`Review: ${summaryPath}`);
    console.log("Apply with: npm run update:site -- --apply");
  }
} catch (error) {
  await mkdir(errorDir, { recursive: true });
  await writeFile(path.join(errorDir, "last-error.txt"), `${new Date().toISOString()}\n${error.stack ?? error}\n`, "utf8");
  throw error;
}
