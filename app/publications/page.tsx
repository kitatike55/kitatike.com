import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const endpoint =
  'https://script.google.com/macros/s/AKfycbzrQsiPgeAxtF3Wi-qASRTgOgEdSB8LNgOqTFPNX8gwA-FruVS1yIMZ741STTPJkkAz/exec';

const sections = [
  ['A', 'Journal', 'Journal', 420],
  ['B', 'International Conference', 'International Conference', 1180],
  ['C', 'Domestic Workshop', 'Domestic Workshop', 2280],
  ['D', 'Invited Lecture', 'Invited Talk', 250],
  ['E', 'Review Article', 'Review Article', 160],
  ['F', 'Other', 'Others', 400],
] as const;

export default function PublicationsPage() {
  return (
    <main className="publication-page">
      <header className="site-header publications-nav">
        <a className="site-name" href="/">Taiki Kitazawa</a>
        <a className="back-link" href="/"><ArrowLeft aria-hidden="true" /> Home</a>
      </header>

      <section className="publication-intro">
        <p className="overline">Research output</p>
        <h1>Publications</h1>
        <p>
          Journal · International Conference · Domestic Workshop · Invited Lecture · Review Article · Other
        </p>
        <a href={`${endpoint}?format=all`} target="_blank" rel="noreferrer">
          Open plain list <ArrowUpRight aria-hidden="true" />
        </a>
      </section>

      <section className="publication-groups" aria-label="Publication categories">
        {sections.map(([letter, title, sheet, height], index) => (
          <details className="publication-group" key={title} open={index === 0}>
            <summary>
              <span>{letter}</span>
              <h2>{title}</h2>
              <span className="summary-action">Open / Close</span>
            </summary>
            <div className="embed-wrap">
              <iframe
                title={`${title} publications`}
                src={`${endpoint}?format=list&sheet=${encodeURIComponent(sheet)}`}
                style={{ height }}
                loading="lazy"
              />
            </div>
          </details>
        ))}
      </section>

      <section className="awards-panel" id="awards">
        <div className="awards-title">
          <p className="overline">Recognition</p>
          <h2>Awards</h2>
        </div>
        <div className="embed-wrap award-embed">
          <iframe
            title="Awards"
            src={`${endpoint}?format=list&sheet=Award`}
            style={{ height: 930 }}
            loading="lazy"
          />
        </div>
      </section>

      <footer>
        <p>Taiki Kitazawa</p>
        <p>Nara Institute of Science and Technology</p>
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
