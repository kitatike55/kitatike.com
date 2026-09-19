const education = [
  ['2026 —', 'Nara Institute of Science and Technology (NAIST)', 'Assistant Professor'],
  ['2023 — 2026', 'Nara Institute of Science and Technology (NAIST)', 'Ph.D. in Engineering, Information Security Engineering Laboratory'],
  ['2024.06 — 2025.02', 'KU Leuven University', 'International Scholar, ESAT / COSIC'],
  ['2021 — 2023', 'Nara Institute of Science and Technology (NAIST)', 'Master of Engineering in Information Science'],
  ['2014 — 2021', 'National Institute of Technology, Nagano College', 'Bachelor of Engineering in Electrical Engineering'],
];

const research = [
  'Hardware Security',
  'TEMPEST',
  'Side-channel Attack',
  'Electromagnetic Compatibility',
  'Signal / Power Integrity Simulation',
  'EM Security',
];

const scholarships = [
  ['2022', 'ICOM Foundation'],
  ['2023 — 2026', 'EPCO Memorial Foundation'],
  ['2023 — 2026', 'Research Fellowships for Young Scientists in Japan (DC1)'],
  ['2024 — 2025', 'JSPS Overseas Challenge Program for Young Researchers'],
];

const links = [
  ['Google Scholar', 'https://scholar.google.co.jp/citations?user=iDmgEs0AAAAJ&hl=ja'],
  ['IEEE Author Details', 'https://ieeexplore.ieee.org/author/37088997455'],
  ['LinkedIn', 'https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile'],
  ['X / Twitter', 'https://x.com/kitatike'],
  ['YouTube', 'https://www.youtube.com/@kitatike_naist'],
  ['ISE Lab.', 'https://www.iselab.jp/index.html'],
];

export default function Home() {
  return (
    <main className="container">
      <header>
        <a className="home-link" href="/">Taiki Kitazawa</a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#research">Research</a>
          <a href="/publications">Publications</a>
          <a href="#links">Links</a>
        </nav>
      </header>

      <section className="profile" id="about">
        <h1>Taiki Kitazawa</h1>
        <p className="name-ja">北澤 太基, Ph.D.</p>
        <div className="affiliation">
          <p>Assistant Professor</p>
          <p>Nara Institute of Science and Technology (NAIST)</p>
          <p>Information Security Engineering Laboratory</p>
        </div>
        <a href="mailto:kitazawa.taiki.kq8@is.naist.jp">kitazawa.taiki.kq8@is.naist.jp</a>
      </section>

      <section>
        <h2>Education &amp; Experience</h2>
        <div className="rows">
          {education.map(([period, school, detail]) => (
            <div className="row" key={`${period}-${school}`}>
              <span>{period}</span>
              <div>
                <p>{school}</p>
                <small>{detail}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="research">
        <h2>Research Themes</h2>
        <ul>
          {research.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h2>Awards &amp; Scholarships</h2>
        <h3>Awards</h3>
        <p><a href="/publications#awards">View awards</a></p>
        <h3>Scholarships</h3>
        <div className="rows compact">
          {scholarships.map(([year, title]) => (
            <div className="row" key={title}>
              <span>{year}</span>
              <p>{title}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Publications</h2>
        <p>Journal, International Conference, Domestic Workshop, Invited Lecture, Review Article, and Other.</p>
        <p><a href="/publications">View publication list</a></p>
      </section>

      <section id="links">
        <h2>Links</h2>
        <ul className="links">
          {links.map(([label, href]) => (
            <li key={label}><a href={href} target="_blank" rel="noreferrer">{label}</a></li>
          ))}
        </ul>
      </section>

      <footer>© {new Date().getFullYear()} Taiki Kitazawa</footer>
    </main>
  );
}
