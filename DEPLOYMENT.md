# Deployment

The portfolio is a static React site served by an unprivileged nginx container on Fly.io.
Its public URL is https://oscar-mendivil.fly.dev/.

## Local checks

```powershell
npm ci
npm run format:check
npm run build
npm run preview -- --host 127.0.0.1 --port 4174
```

No application secrets, database, or persistent volume are required.
Inter is bundled locally rather than loaded from a third-party font service.

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
The runtime image contains static build output and nginx configuration, with no source tree, planning notes, or local credentials.

## Verify a release

- Confirm `/` serves the portfolio over HTTPS and `/healthz` returns `ok`.
- Confirm the generated JavaScript, CSS, and font files load.
- Confirm the portrait, four SPL screenshots, and resume return the correct file types.
- Confirm missing files return 404, and HTTP redirects to HTTPS.
- Inspect the personal cards, project filtering, case-study gallery, keyboard behavior, and mobile layout in a browser.

Browser visual verification has been blocked by the local Computer Use tooling.
Do not treat successful builds or HTTP checks as proof of visual correctness.

## Recovery

Inspect the prior release and its image reference:

```powershell
fly releases --image
```

Redeploy a known good prior image using `fly deploy --image <previous-image-reference> --ha=false`.
There are no data migrations to reverse.
For the first release, a failed deployment can be stopped with `fly scale count 0`; the app and source remain available for repair.

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
Browser visual and interaction verification remains unperformed because the local browser tooling is blocked.
