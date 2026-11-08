# Oscar Mendivil's Portfolio

My personal portfolio, sharing the projects I build, how I approach problems, and a little about life outside the screen.
Built with React, Vite, GSAP, and a self-hosted Inter font, with static hosting on Fly.io.

**[Visit the portfolio](https://oscar-mendivil.fly.dev/)**

## Featured work

- **SPL ERP**: A live desktop and web application bringing client management, events, finances, and business dashboards together.
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

- [Financial dashboard](https://oscar-mendivil.fly.dev/assets/spl-dashboard.png)
- [Event management](https://oscar-mendivil.fly.dev/assets/spl-events.png)
- [Expense breakdown](https://oscar-mendivil.fly.dev/assets/spl-expenses.png)
- [Weekly financial trends](https://oscar-mendivil.fly.dev/assets/spl-trends.png)

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

## Build and deployment

```sh
npm run format:check
npm run build
npm run preview
```

The production build is written to `dist/client/`.
See [DEPLOYMENT.md](DEPLOYMENT.md) for Fly.io publishing, verification, and recovery instructions.
