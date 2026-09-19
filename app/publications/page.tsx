const endpoint =
  'https://script.google.com/macros/s/AKfycbzrQsiPgeAxtF3Wi-qASRTgOgEdSB8LNgOqTFPNX8gwA-FruVS1yIMZ741STTPJkkAz/exec';

const sections = [
  ['Journal', 'Journal', 420],
  ['International Conference', 'International Conference', 1180],
  ['Domestic Workshop', 'Domestic Workshop', 2280],
  ['Invited Lecture', 'Invited Talk', 250],
  ['Review Article', 'Review Article', 160],
  ['Other', 'Others', 400],
] as const;

export default function PublicationsPage() {
  return (
    <main className="container publication-page">
      <header>
        <a className="home-link" href="/">Taiki Kitazawa</a>
        <nav><a href="/">Home</a></nav>
      </header>

      <div className="page-title">
        <h1>Publications</h1>
        <p><a href={`${endpoint}?format=all`} target="_blank" rel="noreferrer">Plain list</a></p>
      </div>

      <div className="publication-groups">
        {sections.map(([title, sheet, height], index) => (
          <details key={title} open={index === 0}>
            <summary>{title}</summary>
            <iframe
              title={`${title} publications`}
              src={`${endpoint}?format=list&sheet=${encodeURIComponent(sheet)}`}
              style={{ height }}
              loading="lazy"
            />
          </details>
        ))}
      </div>

      <section id="awards">
        <h2>Awards</h2>
        <iframe
          className="awards-frame"
          title="Awards"
          src={`${endpoint}?format=list&sheet=Award`}
          style={{ height: 930 }}
          loading="lazy"
        />
      </section>

      <footer>© {new Date().getFullYear()} Taiki Kitazawa</footer>
    </main>
  );
}
