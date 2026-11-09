import { useLayoutEffect, useRef, useState } from "react";
import { FallingSkills } from "./components/FallingSkills.jsx";
import { HeroName } from "./components/HeroName.jsx";
import CompilerDemo from "./components/CompilerDemo.jsx";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  X,
} from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const splShots = [
  {
    src: "/assets/spl-dashboard-30c56a7f.png",
    label: "Financial dashboard",
    alt: "Updated SPL financial dashboard showing collections, payments, outstanding balances, cash profit, and weekly financial trends",
  },
  {
    src: "/assets/spl-expenses-aaf0a570.png",
    label: "Expenses & planning",
    alt: "SPL expense breakdown with a category chart, expense records, upcoming events, and outstanding event balances",
  },
  {
    src: "/assets/spl-events-0385f13e.png",
    label: "Event management",
    alt: "SPL event list with an event detail panel, payment status, and financial records",
  },
  {
    src: "/assets/spl-event-creation-91cca56e.png",
    label: "Create an event",
    alt: "SPL event creation form with fields for business unit, client, venue, date, and agreed price",
  },
  {
    src: "/assets/spl-finances-3b8caa09.png",
    label: "Financial results",
    alt: "SPL finance overview comparing projected results, agreed income, labor costs, recorded expenses, and cash results",
  },
  {
    src: "/assets/spl-payroll-784189f6.png",
    label: "Payroll management",
    alt: "SPL weekly payroll detail with employee base pay, additions, deductions, net pay, and a payment summary",
  },
];

function SplGallery({ motion }) {
  const [index, setIndex] = useState(0);
  const frame = useRef(null);
  useLayoutEffect(() => {
    if (!motion || window.matchMedia("(prefers-reduced-motion:reduce)").matches)
      return;
    const ctx = gsap.context(() =>
      gsap.fromTo(
        frame.current,
        { opacity: 0.3, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      ),
    );
    return () => ctx.revert();
  }, [index, motion]);
  const change = (step) =>
    setIndex((value) => (value + step + splShots.length) % splShots.length);
  return (
    <section
      className="spl-gallery"
      aria-label="SPL application screenshots"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          change(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          change(-1);
        }
      }}
    >
      <figure>
        <a
          href={splShots[index].src}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open full-size ${splShots[index].label}`}
        >
          <img
            ref={frame}
            src={splShots[index].src}
            alt={splShots[index].alt}
          />
        </a>
        <figcaption aria-live="polite">
          <span>{splShots[index].label}</span>
          <span>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(splShots.length).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>
      <div className="gallery-controls">
        <button onClick={() => change(-1)} aria-label="Previous SPL screenshot">
          <ArrowLeft size={20} />
        </button>
        <div className="gallery-tabs">
          {splShots.map((shot, i) => (
            <button
              key={shot.src}
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
            >
              {shot.label}
            </button>
          ))}
        </div>
        <button onClick={() => change(1)} aria-label="Next SPL screenshot">
          <ArrowRight size={20} />
        </button>
      </div>
      <p className="gallery-hint">Select an image to open it at full size.</p>
    </section>
  );
}

const projects = [
  {
    id: "spl",
    name: "SPL ERP",
    category: "Product engineering",
    status: "Live product",
    description:
      "A desktop and web application designed hand in hand with SPL. Bringing clients, events, and finances into one clear picture.",
    tags: ["React", "TypeScript", "Tauri", "NestJS", "PostgreSQL"],
    problem:
      "Excel could no longer give the team a clear view of clients, where the budget was going, or the events ahead.",
    contribution:
      "I worked directly with the company to understand what mattered, then designed and built a dashboard around its priorities. I owned requirements, application and database design, implementation, testing, and deployment.",
    outcome:
      "A running desktop and web application hosted on Fly.io, centralizing client tracking, scheduling, finances, and business dashboards.",
  },
  {
    id: "compiler",
    name: "Compiler",
    category: "Product engineering",
    status: "Personal project",
    cover: (
      <>
        <div className="compiler-cover-editor" aria-hidden="true">
          <div className="compiler-cover-file">
            <span>● ● ●</span> playground.om
          </div>
          <pre>
            <span className="code-keyword">int</span>
            {" twice("}
            <span className="code-keyword">int</span>
            {" value) {\n    "}
            <span className="code-keyword">return</span>
            {" value * "}
            <span className="code-number">2</span>
            {";\n}\n\n"}
            <span className="code-keyword">int</span>
            {" total = twice("}
            <span className="code-number">21</span>
            {");"}
          </pre>
          <p>
            <span aria-hidden="true">↳</span> All checks passed.
          </p>
        </div>
        <span>
          Small language.
          <br />
          Deep understanding.
        </span>
      </>
    ),
    description:
      "A compiler front end built in Python. From a stream of characters to syntax trees, scopes, and type checks. Try it with your own code.",
    tags: ["Python", "Parsing", "Semantic analysis"],
    problem:
      "Understanding what happens between writing code and knowing whether it makes sense: recognizing tokens, structuring expressions, resolving names, and checking types.",
    contribution:
      "I designed a C-like language and implemented its lexer, recursive-descent parser, abstract syntax tree, and semantic analyzer in Python. The analyzer uses nested symbol scopes and a visitor pattern to check declarations, types, and function calls.",
    outcome:
      "A working compiler front end with a browser playground running the original Python implementation. It performs lexical, syntax, and semantic analysis; code generation and program execution are outside its current scope.",
  },
  {
    id: "rag",
    name: "Decisions before retrieval",
    category: "AI architecture",
    status: "Research & recommendation",
    cover: (
      <>
        Before
        <br />
        the answer.<span>Research into better decisions.</span>
      </>
    ),
    description:
      "Research and an architecture recommendation for a smart-building company, exploring Jev as a decision layer before retrieval.",
    tags: ["RAG", "TypeSafe Jev", "Architecture"],
    problem:
      "A smart-building company was exploring RAG while facing concerns about model costs and answer reliability.",
    contribution:
      "Through a conversation about the challenge, I researched and recommended evaluating TypeSafe Jev as a gatekeeper before retrieval.",
    outcome:
      "An architecture recommendation for evaluation. Integration, cost savings, and reliability improvements have not been measured. The company remains private.",
  },
  {
    id: "brain",
    name: "A second brain",
    category: "Personal exploration",
    status: "In progress",
    cover: (
      <>
        Connect
        <br />
        the dots.<span>A second brain, in progress.</span>
      </>
    ),
    description:
      "An evolving knowledge practice in Obsidian. A window into how I learn, connect ideas, and work through everyday problems.",
    tags: ["Obsidian", "Knowledge systems", "Learning"],
    problem:
      "Turning everyday questions, experiences, and new knowledge into something I can return to and build on.",
    contribution:
      "I am building a personal knowledge system in Obsidian to document how I think, connect what I learn, and approach problems.",
    outcome:
      "An ongoing personal workflow, evolving as I learn. This is a knowledge practice rather than a custom software product.",
  },
];
const personalNotes = [
  {
    id: "curiosity",
    label: "Oscar Mendivil",
    name: "Always curious.",
    title: "Curiosity goes beyond code.",
    text: "New AI models always get my attention. So do questions about people: how we develop, how we relate to each other, and how we shape the society around us. I love having something new to learn.",
  },
  {
    id: "outside",
    label: "Life outside the screen",
    name: "Piano, coffee & a little play.",
    title: "A few things that feel like me.",
    text: "Listening to music, playing the piano, going to the gym, drinking coffee, and playing video games. Those are some of my favorite ways to spend time outside work.",
  },
  {
    id: "people",
    label: "How I show up",
    name: "Chill. Funny. A team player.",
    title: "Better with good company.",
    text: "I'd describe myself as funny and laid-back. I'm a team player by default, and I enjoy questioning my own ideas. There is always another perspective worth hearing.",
  },
  {
    id: "limits",
    label: "What keeps me moving",
    name: "What else is possible?",
    title: "I like to test the limits.",
    text: "I love testing the limits of things. Learning something new makes me want to experiment, ask more questions, and find out how much further I can take it.",
  },
];

export function App() {
  const root = useRef(null),
    dialog = useRef(null),
    trigger = useRef(null);
  const [filter, setFilter] = useState("All work"),
    [selected, setSelected] = useState(null),
    [heroNote, setHeroNote] = useState(personalNotes[0]);
  const [motion, setMotion] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useLayoutEffect(() => {
    if (!motion) return;
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(".headline-line span", {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          clearProps: "transform",
        });
        gsap.from(".hero-intro,.hero-aside", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: 0.4,
          clearProps: "all",
        });
        gsap.utils.toArray(".reveal").forEach((el) =>
          gsap.from(el, {
            y: 36,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
            clearProps: "all",
          }),
        );
      },
      root,
    );
    return () => mm.revert();
  }, [motion]);
  useLayoutEffect(() => {
    if (selected && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [selected]);
  const open = (p, e) => {
    trigger.current = e.currentTarget;
    setSelected(p);
  };
  const close = () => {
    dialog.current?.close();
    setSelected(null);
    trigger.current?.focus();
  };
  useLayoutEffect(() => {
    if (
      !heroNote ||
      !motion ||
      window.matchMedia("(prefers-reduced-motion:reduce)").matches
    )
      return;
    const ctx = gsap.context(
      () =>
        gsap.fromTo(
          ".hero-note-detail",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        ),
      root,
    );
    return () => ctx.revert();
  }, [heroNote, motion]);
  const hover = (e, active) => {
    if (
      motion &&
      window.matchMedia(
        "(hover:hover) and (prefers-reduced-motion:no-preference)",
      ).matches
    )
      gsap.to(e.currentTarget.querySelector(".project-cover"), {
        y: active ? -7 : 0,
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
      });
  };
  return (
    <div ref={root} className={motion ? "" : "motion-off"}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a href="#" className="wordmark">
          OSCAR<span> / </span>MENDIVIL
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a
            href="/assets/oscar-mendivil-resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Résumé <ArrowUpRight />
          </a>
        </nav>
        <a
          className="button dark"
          href="https://www.linkedin.com/in/oscar-mendivil-gutierrez"
          target="_blank"
          rel="noreferrer"
        >
          Let's talk <ArrowUpRight weight="bold" />
        </a>
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-intro">
            <p className="eyebrow">OSCAR MENDIVIL / AI ENGINEERING</p>
            <p>
              I turn real problems into useful software. Working closely with
              people. Exploring what AI makes possible. Always learning what
              comes next.
            </p>
            <a href="#work" className="button dark">
              Explore my work <ArrowDown weight="bold" />
            </a>
          </div>
          <div className="hero-title">
            <FallingSkills motion={motion} />
            <HeroName />
            <div className="hero-title-meta">
              <span>BUILT WITH PEOPLE. DRIVEN BY CURIOSITY.</span>
              <span>BASED IN MEXICALI, MX</span>
            </div>
          </div>
          <aside className="hero-aside">
            <p>
              Software developer.
              <br />
              AI engineer in the making.
              <br />
              Curiosity, put into practice.
            </p>
            <div className="side-links">
              <a
                href="https://github.com/omendivilg"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <ArrowUpRight />
              </a>
              <a
                href="https://www.linkedin.com/in/oscar-mendivil-gutierrez"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <ArrowUpRight />
              </a>
            </div>
            <span className="aside-index">(01 - INTRODUCTION)</span>
          </aside>
          <div className="hero-visual reveal">
            <img
              className="hero-photo"
              src="/assets/oscar-studio.png"
              alt="Portrait of Oscar Mendivil in a black suit and red tie"
              width="1254"
              height="1254"
              fetchPriority="high"
            />
            <div className="hero-note-links" aria-label="Get to know Oscar">
              {personalNotes.map((note) => (
                <button
                  key={note.id}
                  className="hero-note-card"
                  aria-pressed={heroNote?.id === note.id}
                  aria-controls="hero-note-detail"
                  onClick={() =>
                    setHeroNote((current) =>
                      current?.id === note.id ? null : note,
                    )
                  }
                >
                  <span>{note.label}</span>
                  <strong>
                    {note.name}
                    <ArrowUpRight size={16} />
                  </strong>
                </button>
              ))}
            </div>
            <div
              id="hero-note-detail"
              className="hero-note-detail"
              hidden={!heroNote}
              aria-live="polite"
            >
              {heroNote && (
                <>
                  <div className="hero-detail-heading">
                    <p className="eyebrow">{heroNote.label}</p>
                    <button
                      onClick={() => setHeroNote(null)}
                      aria-label="Close personal note"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <h2>{heroNote.title}</h2>
                  <p>{heroNote.text}</p>
                </>
              )}
            </div>
          </div>
        </section>
        <section className="work" id="work" aria-labelledby="work-heading">
          <div className="section-heading reveal">
            <h2 id="work-heading">
              Selected
              <br />
              work & ideas.
            </h2>
            <span className="section-count">(0{projects.length})</span>
          </div>
          <div className="work-grid">
            <aside className="work-filter">
              <p className="eyebrow">A FEW THINGS I'M BUILDING</p>
              <div className="filter-list" aria-label="Filter projects">
                {["All work", ...new Set(projects.map((p) => p.category))].map(
                  (label) => (
                    <button
                      key={label}
                      aria-pressed={filter === label}
                      className={filter === label ? "active" : ""}
                      onClick={() => {
                        setFilter(label);
                        requestAnimationFrame(() => ScrollTrigger.refresh());
                      }}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>
              <p className="filter-note">
                From a live business application
                <br />
                to the next question worth asking.
              </p>
            </aside>
            <div className="project-list" aria-live="polite">
              {projects
                .filter((p) => filter === "All work" || p.category === filter)
                .map((p) => (
                  <article className="project" key={p.id}>
                    <button
                      className={`project-open project-${p.id}`}
                      onMouseEnter={(e) => hover(e, true)}
                      onMouseLeave={(e) => hover(e, false)}
                      onClick={(e) => open(p, e)}
                      aria-label={`Read ${p.name} case study`}
                    >
                      <div className="project-cover">
                        <div className="cover-top">
                          <span>{p.category}</span>
                          <ArrowUpRight size={25} />
                        </div>
                        <div
                          className={`cover-type${p.id === "spl" ? " screenshot-cover" : ""}`}
                        >
                          {p.id === "spl" ? (
                            <>
                              <img
                                src={splShots[0].src}
                                alt="SPL financial dashboard preview"
                                loading="lazy"
                              />
                              <span>
                                SPL ERP
                                <br />
                                Built for the real world.
                              </span>
                            </>
                          ) : (
                            p.cover
                          )}
                        </div>
                        <div className="cover-bottom">
                          <span>{p.status}</span>
                          <span>/0{projects.indexOf(p) + 1}</span>
                        </div>
                      </div>
                    </button>
                    <div className="project-heading">
                      <h3>
                        <button onClick={(e) => open(p, e)}>{p.name}</button>
                      </h3>
                      <span>0{projects.indexOf(p) + 1}</span>
                    </div>
                    <p>{p.description}</p>
                    <div className="tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>
        <section
          className="about reveal"
          id="about"
          aria-labelledby="about-heading"
        >
          <div>
            <p className="eyebrow">A LITTLE ABOUT ME</p>
            <p className="about-location">
              Mexicali, Baja California.
              <br />
              Open to what's next.
            </p>
          </div>
          <div>
            <h2 id="about-heading">
              Technology moves fast.
              <br />I like to stay curious.
            </h2>
            <p>
              I'm Oscar, a software developer pursuing AI engineering. I enjoy
              understanding how things work, trying emerging tools, and turning
              what I learn into something useful.
            </p>
            <p>
              My work starts with listening. At SPL, that meant working directly
              with a company to build software around its day-to-day needs.
              Beyond that, I'm exploring AI architecture and building a personal
              knowledge system in Obsidian.
            </p>
            <a
              className="text-link"
              href="/assets/oscar-mendivil-resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Read my résumé <ArrowUpRight />
            </a>
          </div>
        </section>
        <section className="contact reveal" id="contact">
          <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          <a
            className="contact-title"
            href="https://www.linkedin.com/in/oscar-mendivil-gutierrez"
            target="_blank"
            rel="noreferrer"
          >
            Let's build
            <br />
            something useful.
            <ArrowUpRight />
          </a>
          <div className="contact-bottom">
            <a
              href="https://www.linkedin.com/in/oscar-mendivil-gutierrez"
              target="_blank"
              rel="noreferrer"
            >
              Connect on LinkedIn
            </a>
            <a href="tel:+526861969697">+52 686 196 9697</a>
            <a
              href="https://github.com/omendivilg"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight />
            </a>
          </div>
        </section>
      </main>
      <footer>
        <span>© {new Date().getFullYear()} OSCAR MENDIVIL</span>
        <button onClick={() => setMotion(!motion)} aria-pressed={!motion}>
          Motion: {motion ? "on" : "off"}
        </button>
        <a href="#">
          Back to top <ArrowUpRight />
        </a>
      </footer>
      <dialog
        ref={dialog}
        className={`case-study${selected?.id === "compiler" ? " compiler-case-study" : selected?.id === "spl" ? " spl-case-study" : ""}`}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        aria-labelledby="case-title"
      >
        {selected && (
          <div className="case-inner">
            <button className="case-close button" onClick={close}>
              Close <X />
            </button>
            <p className="eyebrow">
              {selected.category} / {selected.status}
            </p>
            <h2 id="case-title">{selected.name}</h2>
            {selected.id === "spl" && <SplGallery motion={motion} />}
            {selected.id === "compiler" && <CompilerDemo />}
            {[
              ["The problem", selected.problem],
              ["My contribution", selected.contribution],
              ["Where it stands", selected.outcome],
            ].map(([title, text]) => (
              <div className="case-section" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
            <div className="tags">
              {selected.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <a
              className="text-link"
              href={
                selected.id === "compiler"
                  ? "https://github.com/omendivilg/Compilador"
                  : "https://www.linkedin.com/in/oscar-mendivil-gutierrez"
              }
              target="_blank"
              rel="noreferrer"
            >
              {selected.id === "compiler"
                ? "Explore the compiler on GitHub"
                : "Discuss this project on LinkedIn"}{" "}
              <ArrowUpRight />
            </a>
          </div>
        )}
      </dialog>
    </div>
  );
}
