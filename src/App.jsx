import { useState, useEffect, useMemo, useRef } from 'react'
import './App.css'

/* ---------- tiny icon helper ---------- */
const Icon = ({ d, className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const I = {
  gh: ['M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4', 'M9 18c-4.51 2-5-2-7-2'],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 7-10 7L2 7'],
  sun: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'],
  moon: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z'],
  pin: ['M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z', 'M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'],
  up: ['M7 17 17 7', 'M7 7h10v10'],
}

/* ---------- animated background: sunset ocean / night sky ---------- */
const WAVE = 'M0 40q150-40 300 0t300 0 300 0 300 0 300 0 300 0 300 0 300 0V70H0z'

function Wave({ top, duration, opacity, reverse }) {
  return (
    <svg
      className="wave"
      viewBox="0 0 2400 70"
      preserveAspectRatio="none"
      style={{ top, opacity, animationDuration: duration, animationDirection: reverse ? 'reverse' : 'normal' }}
    >
      <path d={WAVE} />
    </svg>
  )
}

function Scene() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 55,
        s: 1 + Math.random() * 2,
        d: (2 + Math.random() * 4).toFixed(1) + 's',
        l: (Math.random() * 4).toFixed(1) + 's',
      })),
    []
  )

  return (
    <div className="fx" aria-hidden="true">
      <div className="fx sky-day" />
      <div className="fx sky-night" />

      {stars.map((s, i) => (
        <span key={i} className="star" style={{ left: s.x + '%', top: s.y + '%', width: s.s, height: s.s, '--d': s.d, animationDelay: s.l }} />
      ))}
      <div className="shoot" />

      <div className="cloud" style={{ top: '14vh', width: 140, animationDuration: '95s', animationDelay: '-20s' }} />
      <div className="cloud" style={{ top: '30vh', width: 100, animationDuration: '130s', animationDelay: '-70s' }} />
      <div className="cloud" style={{ top: '8vh', width: 170, animationDuration: '160s', animationDelay: '-110s' }} />

      {/* Sunset sun: glow + striped retro disc, sinking into the horizon */}
      <div className="orb sun">
        <div className="sun-glow" />
        <div className="sun-disc" />
      </div>

      {/* Moon */}
      <div className="orb moon">
        <i style={{ width: '22%', height: '22%', left: '55%', top: '20%' }} />
        <i style={{ width: '14%', height: '14%', left: '25%', top: '55%' }} />
        <i style={{ width: '18%', height: '18%', left: '60%', top: '62%' }} />
      </div>

      <div className="ocean">
        <Wave top={-52} duration="22s" opacity={0.45} />
        <div className="boat">
          <svg width="56" height="44" viewBox="0 0 56 44">
            <path d="M28 2v28M28 4l18 24H28z" fill="#fff" stroke="#cbd5e1" />
            <path d="M26 8 10 28h16z" fill="#fde68a" />
            <path d="M4 32h48l-8 10H12z" fill="#7c2d12" />
          </svg>
        </div>
        <Wave top={-40} duration="15s" opacity={0.75} reverse />
        <div className="glint" />
        <Wave top={-26} duration="10s" opacity={1} />
      </div>
    </div>
  )
}

/* ---------- small building blocks ---------- */
function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`rv ${className}`}>{children}</div>
}

const Tag = ({ t }) => (
  <li className="tag rounded-full px-3 py-1 text-xs font-medium text-accent">{t}</li>
)

const Bullets = ({ items }) => (
  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-mute">
    {items.map((t, i) => (
      <li key={i} className="flex gap-2">
        <span className="text-accent">▹</span>
        {t}
      </li>
    ))}
  </ul>
)

function Section({ id, title, children }) {
  return (
    <section id={id} aria-label={title} className="mb-20 scroll-mt-20 lg:mb-28">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-widest lg:sr-only">{title}</h2>
      {children}
    </section>
  )
}

/* ---------- data ---------- */
const SECTIONS = ['about', 'experience', 'projects', 'skills']

const EXPERIENCE = [
  'Encoded and managed procurement details and inventory records accurately using Microsoft Excel.',
  'Maintained organized digital databases, ensuring high data integrity and efficient retrieval of company records.',
  'Assisted the procurement team by streamlining daily record-handling tasks and supporting routine administrative operations.',
]

const PROJECT = [
  'Engineered a full-stack platform on an MVC architecture covering user registration, secure login and complete quiz workflows: creating, fetching and managing.',
  'Built a dynamic React frontend integrated with a scalable REST API powered by Node.js and Express.js.',
  'Designed relational storage in MySQL, connected through the mysql2 package.',
  'Containerized the whole development environment with Docker and Docker Compose, using live-sync bind mounts.',
  'Secured user passwords with Bcrypt hashing.',
]

const SKILLS = [
  ['Frontend', ['React', 'HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS']],
  ['Backend', ['Node.js', 'Express.js']],
  ['Database', ['MySQL', 'mysql2']],
  ['Tools & Env', ['Docker', 'Docker Compose', 'Git', 'VS Code', 'Thunder Client', 'Nodemon']],
  ['Core Concepts', ['MVC Architecture', 'RESTful APIs', 'Bcrypt Security']],
]

/* ---------- app ---------- */
export default function App() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [active, setActive] = useState('about')

  // theme: apply class + remember choice
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('jd-theme', dark ? 'dark' : 'light') } catch { /* ignore */ }
  }, [dark])

  // scroll-spy for the sidebar nav
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -65% 0px' }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Scene />

      <button
        onClick={() => setDark(!dark)}
        aria-label="Toggle sunset and night theme"
        title={dark ? 'Switch to sunset' : 'Switch to night'}
        className="pane fixed right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-110 hover:text-accent"
      >
        <Icon d={dark ? I.sun : I.moon} />
      </button>

      <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-12 md:px-12 md:py-16 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          {/* ---------- left: sticky intro ---------- */}
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[46%] lg:flex-col lg:justify-between lg:py-24">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                <a href="#about">Joshuel Dinong</a>
              </h1>
              <h2 className="mt-3 text-lg font-medium sm:text-xl">Junior Web Developer</h2>
              <p className="mt-4 max-w-xs leading-normal text-mute">
                I build scalable, containerized web experiences with React, Node.js and MySQL.
              </p>
              <p className="mt-3 flex items-center gap-1 text-sm text-mute">
                <Icon d={I.pin} className="h-4 w-4" /> Cabuyao, Laguna
              </p>

              <nav className="mt-16 hidden lg:block" aria-label="In-page navigation">
                <ul>
                  {SECTIONS.map((s) => {
                    const on = active === s
                    return (
                      <li key={s}>
                        <a href={`#${s}`} className="group flex items-center py-3">
                          <span className={`mr-4 h-px bg-current transition-all duration-300 ${on ? 'w-16 text-ink' : 'w-8 text-mute group-hover:w-16 group-hover:text-ink'}`} />
                          <span className={`text-xs font-bold uppercase tracking-widest transition ${on ? 'text-ink' : 'text-mute group-hover:text-ink'}`}>{s}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>

            <div className="mt-8 flex items-center gap-5 lg:mt-0">
              <a href="https://github.com/kyroijijadas" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition hover:scale-110 hover:text-accent">
                <Icon d={I.gh} className="h-6 w-6" />
              </a>
              <a href="mailto:jdinong38@gmail.com" aria-label="Email" className="transition hover:scale-110 hover:text-accent">
                <Icon d={I.mail} className="h-6 w-6" />
              </a>
            </div>
          </header>

          {/* ---------- right: content ---------- */}
          <main className="pt-12 lg:w-1/2 lg:py-24">
            <Section id="about" title="About">
              <Reveal className="pane rounded-2xl p-6 leading-relaxed">
                <p className="mb-4">
                  I am a motivated, detail-oriented aspiring <b>Junior Web Developer</b> with a strong foundation in full-stack technologies including React, Node.js and MySQL. I enjoy building scalable, containerized applications with modern MVC architecture.
                </p>
                <p className="mb-4">
                  Before moving into development, I worked as a Data Entry Specialist, where accuracy and data integrity became habits I now bring to every line of code.
                </p>
                <p>
                  I am eager to apply my hands-on experience and problem-solving skills to build efficient, user-centric solutions within a collaborative development team.
                </p>
              </Reveal>
            </Section>

            <Section id="experience" title="Experience">
              <ol className="list space-y-6">
                <li>
                  <Reveal className="item pane rounded-2xl p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-mute">Feb 2026 — Sep 2026</p>
                    <h3 className="mt-2 font-semibold">Data Entry Specialist · TNC Procurement Company</h3>
                    <Bullets items={EXPERIENCE} />
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {['Microsoft Excel', 'Data Integrity', 'Record Management'].map((t) => <Tag key={t} t={t} />)}
                    </ul>
                  </Reveal>
                </li>
              </ol>
            </Section>

            <Section id="projects" title="Projects">
              <ul className="list space-y-6">
                <li>
                  <Reveal className="item pane rounded-2xl p-6">
                    <a href="https://github.com/kyroijijadas" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 font-semibold hover:text-accent">
                      Autodidact.io — Full-Stack Educational Quiz Platform
                      <span className="transition group-hover:-translate-y-0.5 group-hover:translate-x-1">
                        <Icon d={I.up} className="h-4 w-4" />
                      </span>
                    </a>
                    <Bullets items={PROJECT} />
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {['React', 'Node.js', 'Express.js', 'MySQL', 'Docker', 'Bcrypt'].map((t) => <Tag key={t} t={t} />)}
                    </ul>
                  </Reveal>
                </li>
              </ul>
            </Section>

            <Section id="skills" title="Skills">
              <div className="grid gap-4 sm:grid-cols-2">
                {SKILLS.map(([k, v]) => (
                  <Reveal key={k} className="pane rounded-2xl p-5">
                    <h3 className="mb-3 text-sm font-semibold">{k}</h3>
                    <ul className="flex flex-wrap gap-2">
                      {v.map((t) => <Tag key={t} t={t} />)}
                    </ul>
                  </Reveal>
                ))}
              </div>
            </Section>

            <footer className="pb-16 text-sm text-mute">
              @ 2026 All rights reserved.
            </footer>
          </main>
        </div>
      </div>
    </>
  )
}
