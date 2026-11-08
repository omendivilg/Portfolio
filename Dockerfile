FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY index.html vite.config.mjs ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/client /usr/share/nginx/html
RUN nginx -t
EXPOSE 8080
