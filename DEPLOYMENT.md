# Deployment

The portfolio is a static React site served by an unprivileged nginx container on Fly.io.
Its public URL is https://oscar-mendivil.fly.dev/.

## Local checks

```powershell
npm ci
npm run format:check
npm run build
node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4174
npx playwright install chromium
npm run test:e2e
```

No application secrets, database, or persistent volume are required.
Inter is bundled locally rather than loaded from a third-party font service.
The compiler's pinned Python runtime is also served locally, under `/runtime/python/<version>/`, and loads only when its case study opens.

## Publish an update

Run these commands from the repository root while authenticated to Fly.io:

```powershell
fly config validate
fly deploy --remote-only --ha=false
fly status
fly checks list
```

The configuration runs one shared CPU Machine with 256 MB RAM in Los Angeles.
One Machine stays running to avoid idle cold starts.
This is billed according to Fly.io's current rates, account terms, and resource usage.
A single Machine has no redundant instance during a host failure.
Use the shared IPv4 and default Fly domain; no dedicated paid IPv4 is required.

Only the Dockerfile's explicit build inputs enter the build context.
The runtime image contains static build output and nginx configuration, including the compiler's intentionally public Python modules.
The portfolio source tree, planning notes, and local credentials are excluded.

## Verify a release

- Confirm `/` serves the portfolio over HTTPS and `/healthz` returns `ok`.
- Confirm the generated JavaScript, CSS, and font files load.
- Confirm the portrait, seven SPL screenshots, and resume return the correct file types.
- Confirm the compiler's versioned `.mjs` modules use a JavaScript content type and its `.wasm` file uses `application/wasm`.
- Confirm missing files return 404, and HTTP redirects to HTTPS.
- Inspect the personal cards, project filtering, case-study gallery, keyboard behavior, and mobile layout in a browser.

Use the Playwright suite for local desktop and phone-sized browser verification against the production build.
Also inspect the deployed hero and run the compiler's valid and error examples after publishing.
Local browser checks do not replace verification of the deployed nginx response types and worker loading.

## Recovery

Inspect the prior release and its image reference:

```powershell
fly releases --image
```

Redeploy a known good prior image using `fly deploy --image <previous-image-reference> --ha=false`.
There are no data migrations to reverse.
For the first release, a failed deployment can be stopped with `fly scale count 0`; the app and source remain available for repair.

## Verified SPL visual refresh

Release v6 adds the seventh SPL screenshot for standalone income and expense analysis, from source commit `8939392`.
Its image is `registry.fly.io/oscar-mendivil:deployment-01M6YXQ4PQK1F2KDHSAE5V483G`.
The desktop and mobile gallery checks pass against the live site, the new image matches the supplied original, and the HTTP health check is passing.
The previous known good image is the v5 image recorded below.

Release v5 was published from source commit `8786255` on `main`.
The deployed image is `registry.fly.io/oscar-mendivil:deployment-01M6YXGJ7FJN9CRH1B1TNTZHVB`.
The release replaces the previous four SPL screenshots with six current views, updates the project cover, and widens the SPL gallery.
All 10 local browser checks passed, and the desktop and mobile gallery checks passed against the live site.
All six production image files match the supplied originals byte for byte, the old image paths return 404, and the HTTP health check is passing.
The previous known good release is v4, using image `registry.fly.io/oscar-mendivil:deployment-01M6YVCGZTEVVCR78RSZFFDW5Q`.

## Verified hero and compiler release

Release v4 was published on November 8, 2026 (America/Tijuana), from source commit `646bd02` on `main`.
The deployed image is `registry.fly.io/oscar-mendivil:deployment-01M6YVCGZTEVVCR78RSZFFDW5Q`.
Machine `815132c93690d8` remains in `lax`, and the HTTP health check is passing.

The production build and nginx configuration validation passed during the remote build.
All 10 desktop and mobile Playwright checks passed against the public HTTPS site, covering falling skills, dragging, reduced motion, compiler analysis and recovery, project filters, personal notes, and the SPL gallery.
Desktop and mobile screenshots were visually inspected, including the name fitting the available width.
The homepage, health endpoint, built assets, portrait, screenshots, resume, Python modules, and versioned runtime files returned the expected responses and file types.
HTTP redirects to HTTPS, and missing files, portfolio source paths, scratch artifacts, and `.env` paths return 404.

The previous known good release is v3, using image `registry.fly.io/oscar-mendivil:deployment-01M6FB44670BXAAYV6X3Q6T3Z9`.
Use that image with the recovery command above if rollback is required.

## Verified first release

Deployed on November 2, 2026, with image `registry.fly.io/oscar-mendivil:deployment-01M6FB44670BXAAYV6X3Q6T3Z9`.
This is the first known good image for future recovery.
The earlier deployment image failed nginx startup and must not be used as a rollback target.
Machine `815132c93690d8` runs in `lax`, and Fly's HTTP health check is passing.

Verified checks:

- Source formatting passes and the production build succeeds locally and in the remote container build.
- `npm audit` reports zero vulnerabilities after updating Vite to 6.4.5.
- The Docker build runs `nginx -t` successfully before publishing the image.
- The public HTTPS page, health endpoint, JavaScript, stylesheet, self-hosted font, portrait, four screenshots, and resume respond with HTTP 200 and expected content types.
- The served JavaScript includes the personal-card content and excludes the prototype banner and email actions.
- Missing files, source paths, planning notes, and `.env` paths return HTTP 404.
- The homepage includes the expected content-type, referrer-policy, and frame-protection headers.

No database or migration was involved.
Production publication was authorized by Oscar's explicit request to get the portfolio online.
At the first release, browser visual and interaction verification was unperformed because the local browser tooling was blocked.
