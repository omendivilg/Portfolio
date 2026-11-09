# Oscar Mendivil's Portfolio

My personal portfolio, sharing the projects I build, how I approach problems, and a little about life outside the screen.
Built with React, Vite, GSAP, and a self-hosted Inter font, with static hosting on Fly.io.

**[Visit the portfolio](https://oscar-mendivil.fly.dev/)**

## Featured work

- **SPL ERP**: A live desktop and web application bringing client management, events, finances, and business dashboards together.
- **[Compiler](https://github.com/omendivilg/Compilador)**: A personal Python compiler front end for a C-like language, with an editable browser demo for lexical, syntax, and semantic analysis.
- **RAG architecture study**: Research and an architecture recommendation exploring TypeSafe Jev as a decision layer before retrieval for a private smart-building company.
- **Obsidian second brain**: An ongoing personal knowledge system for connecting ideas, documenting learning, and working through everyday questions.

Explore the [work](https://oscar-mendivil.fly.dev/#work) and [about](https://oscar-mendivil.fly.dev/#about) sections on the live site.

## Links and contact

- [LinkedIn](https://www.linkedin.com/in/oscar-mendivil-gutierrez) - professional contact
- [GitHub profile](https://github.com/omendivilg)
- [Portfolio repository](https://github.com/omendivilg/Portfolio)
- [Resume (PDF)](https://oscar-mendivil.fly.dev/assets/oscar-mendivil-resume.pdf)
- [Phone: +52 686 196 9697](tel:+526861969697)

SPL screenshots shown in the portfolio:

- [Financial dashboard](https://oscar-mendivil.fly.dev/assets/spl-dashboard-30c56a7f.png)
- [Expenses and planning](https://oscar-mendivil.fly.dev/assets/spl-expenses-aaf0a570.png)
- [Event management](https://oscar-mendivil.fly.dev/assets/spl-events-0385f13e.png)
- [Event creation](https://oscar-mendivil.fly.dev/assets/spl-event-creation-91cca56e.png)
- [Financial results](https://oscar-mendivil.fly.dev/assets/spl-finances-3b8caa09.png)
- [Payroll management](https://oscar-mendivil.fly.dev/assets/spl-payroll-784189f6.png)

## Run locally

Install Node.js and npm, then run:

```sh
git clone https://github.com/omendivilg/Portfolio.git
cd Portfolio
npm ci
npm run dev
```

Open the local URL printed by Vite.
Application code lives in `src/`, and images and the resume live in `public/assets/`.

## Interactive features

The name hero uses Matter.js for falling skill pills, pointer dragging, and keyboard tossing.
It honors the system reduced-motion preference and the footer motion toggle.
Physics pauses when the hero is offscreen or the browser tab is hidden, and stops rendering once the pills settle.

The Compiler case study lazy-loads the original Python implementation in a Pyodide module worker.
The pinned Python runtime is served locally and is copied from the npm dependency during the Vite build.
Opening the compiler downloads approximately 13 MB of runtime files before HTTP compression; the homepage does not request them.
The demo accepts a custom C-like language and performs static checks without executing the submitted program.
Source stays in the browser.
The worker has loading and execution timeouts, can be retried after an error, and terminates when the case study closes.
See [compiler source provenance](src/compiler/SOURCE.md) for the original revision and adapter boundaries.

Run the browser checks against a production build:

```sh
npx playwright install chromium
npm run test:e2e
```

The tests cover desktop and phone-sized Chromium, the actual Python runtime, compiler diagnostics and recovery, hero interaction and reduced motion, project filters, and the existing portrait and SPL gallery.

## Build and deployment

```sh
npm run format:check
npm run build
npm run preview
```

The production build is written to `dist/client/`.
See [DEPLOYMENT.md](DEPLOYMENT.md) for Fly.io publishing, verification, and recovery instructions.
