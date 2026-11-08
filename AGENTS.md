# Portfolio

This is Oscar Mendivil's public portfolio, built with React, Vite, and GSAP and deployed as static files on Fly.io.
The production app is at the repository root.
Exploration artifacts remain under `.scratch/portfolio/` and are excluded from deployment.

## Design and content

Use the supplied Monolog references for typography and the asymmetric light layout.
SPL screenshots demonstrate Oscar's work; their application styling does not define the portfolio's design.
Keep the studio portrait as the only hero image, with personal caption cards and sufficient headroom.
All professional contact actions use LinkedIn, with the phone contact preserved.
Present SPL as live work, the RAG contribution as research and architecture recommendation, and Obsidian as ongoing personal exploration.
Keep the smart-building company's name private.

## Deployment

Use the root `fly.toml` and Dockerfile for the `oscar-mendivil` Fly app.
See `DEPLOYMENT.md` for verification and recovery.
Changes to this portfolio must not affect the separate `spl-crm` Fly app.
