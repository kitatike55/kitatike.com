import { ArrowUpRight, Mail } from 'lucide-react';

const education = [
  {
    period: '2026 —',
    school: 'Nara Institute of Science and Technology (NAIST)',
    detail: 'Assistant Professor',
  },
  {
    period: '2023 — 2026',
    school: 'Nara Institute of Science and Technology (NAIST)',
    detail: 'Ph.D. in Engineering, Information Security Engineering Laboratory',
  },
  {
    period: '2024.06 — 2025.02',
    school: 'KU Leuven University',
    detail: 'International Scholar, ESAT / COSIC',
  },
  {
    period: '2021 — 2023',
    school: 'Nara Institute of Science and Technology (NAIST)',
    detail: 'Master of Engineering in Information Science',
  },
  {
    period: '2014 — 2021',
    school: 'National Institute of Technology, Nagano College',
    detail: 'Bachelor of Engineering in Electrical Engineering',
  },
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
    <main>
      <header className="site-header">
        <a className="site-name" href="#top">Taiki Kitazawa</a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#research">Research</a>
          <a href="/publications">Publications</a>
          <a href="#links">Links</a>
        </nav>
      </header>

      <section className="intro" id="top">
        <div className="intro-title">
          <p className="overline">Personal homepage</p>
          <h1>Taiki Kitazawa</h1>
          <p className="name-ja">北澤 太基 <span>Ph.D.</span></p>
        </div>
        <div className="intro-profile">
          <p className="role">Assistant Professor</p>
          <p>Nara Institute of Science and Technology (NAIST)</p>
          <p>Information Security Engineering Laboratory</p>
          <a className="email" href="mailto:kitazawa.taiki.kq8@is.naist.jp">
            <Mail aria-hidden="true" /> kitazawa.taiki.kq8@is.naist.jp
          </a>
        </div>
      </section>

      <section className="section two-column" id="about">
        <div className="section-label">
          <span>01</span>
          <h2>Education &amp;<br />Experience</h2>
        </div>
        <div className="timeline">
          {education.map((item) => (
            <article className="timeline-row" key={`${item.period}-${item.school}`}>
              <p className="period">{item.period}</p>
              <div>
                <h3>{item.school}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section two-column" id="research">
        <div className="section-label">
          <span>02</span>
          <h2>Research<br />Themes</h2>
        </div>
        <ul className="research-list">
          {research.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="section two-column">
        <div className="section-label">
          <span>03</span>
          <h2>Awards &amp;<br />Scholarships</h2>
        </div>
        <div>
          <div className="subsection-heading">
            <h3>Awards</h3>
            <a href="/publications#awards">View awards <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <div className="scholarship-block">
            <h3>Scholarships</h3>
            {scholarships.map(([year, title]) => (
              <div className="compact-row" key={title}>
                <span>{year}</span>
                <p>{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="publication-callout">
        <div>
          <p className="overline">Research output</p>
          <h2>Publications</h2>
        </div>
        <p>
          Journal · International Conference · Domestic Workshop · Invited Lecture · Review Article · Other
        </p>
        <a href="/publications">View publication list <ArrowUpRight aria-hidden="true" /></a>
      </section>

      <section className="section two-column" id="links">
        <div className="section-label">
          <span>04</span>
          <h2>Links</h2>
        </div>
        <div className="link-grid">
          {links.map(([label, href]) => (
            <a href={href} key={label} target="_blank" rel="noreferrer">
              {label}<ArrowUpRight aria-hidden="true" />
            </a>
          ))}
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
