import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(projectDir, "content", "site.json");
const outputPath = path.join(projectDir, "index.html");

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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeUrl(value) {
  const url = String(value);
  if (!url.startsWith("https://")) {
    throw new Error(`Links must use HTTPS: ${url}`);
  }
  return escapeHtml(url);
}

function educationRow(item) {
  return `          <div class="row"><span>${escapeHtml(item.period)}</span><div><p>${escapeHtml(item.organization)}</p><small>${escapeHtml(item.detail)}</small></div></div>`;
}

function researchGroup(group) {
  const topics = group.topics
    .map((topic) => `              <li>${escapeHtml(topic)}</li>`)
    .join("\n");
  return `          <div class="research-group">
            <h3>${escapeHtml(group.name)}</h3>
            <ul>
${topics}
            </ul>
          </div>`;
}

function scholarshipRow(item) {
  return `          <div class="row"><span>${escapeHtml(item.period)}</span><p>${escapeHtml(item.name)}</p></div>`;
}

function linkRow(item) {
  return `          <li><a href="${safeUrl(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.label)}</a></li>`;
}

export function renderSite(site) {
  const affiliationLines = [site.profile.position, ...site.profile.affiliations]
    .map((line) => `          <p>${escapeHtml(line)}</p>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(site.meta.title)}</title>
    <meta name="description" content="${escapeHtml(site.meta.description)}" />
    <meta property="og:title" content="${escapeHtml(site.meta.title)}" />
    <meta property="og:description" content="${escapeHtml(site.meta.ogDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="./public/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="./public/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main class="container">
      <header>
        <a class="home-link" href="./">${escapeHtml(site.profile.name)}</a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#research">Research</a>
          <a href="./publications/">Publications</a>
          <a href="#links">Links</a>
        </nav>
      </header>

      <section class="profile" id="about">
        <h1>${escapeHtml(site.profile.name)}</h1>
        <p class="name-ja">${escapeHtml(site.profile.nameJa)}</p>
        <div class="affiliation">
${affiliationLines}
        </div>
        <a href="mailto:${escapeHtml(site.profile.email)}">${escapeHtml(site.profile.email)}</a>
      </section>

      <section>
        <h2>Education &amp; Experience</h2>
        <div class="rows">
${site.educationExperience.map(educationRow).join("\n")}
        </div>
      </section>

      <section id="research">
        <h2>Research Themes</h2>
        <div class="research-groups">
${site.researchThemes.map(researchGroup).join("\n")}
        </div>
      </section>

      <section>
        <h2>Awards &amp; Scholarships</h2>
        <h3>Awards</h3>
        <p><a href="./publications/#awards">View awards</a></p>
        <h3>Scholarships</h3>
        <div class="rows compact">
${site.scholarships.map(scholarshipRow).join("\n")}
        </div>
      </section>

      <section>
        <h2>Publications</h2>
        <p>${escapeHtml(site.publicationsDescription)}</p>
        <p><a href="./publications/">View publication list</a></p>
      </section>

      <section id="links">
        <h2>Links</h2>
        <ul class="links">
${site.links.map(linkRow).join("\n")}
        </ul>
      </section>

      <footer>© <span id="year"></span> ${escapeHtml(site.profile.name)}</footer>
    </main>
    <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
  </body>
</html>
`;
}

export async function buildSite() {
  const site = JSON.parse(await readDropboxFile(contentPath));
  await writeFile(outputPath, renderSite(site), "utf8");
  return outputPath;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const written = await buildSite();
  console.log(`Generated ${written}`);
}
