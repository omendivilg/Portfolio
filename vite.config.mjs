import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {
  copyFileSync,
  createReadStream,
  mkdirSync,
  readFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const pythonFiles = [
  "pyodide.mjs",
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
];
const pythonDirectory = fileURLToPath(
  new URL("./node_modules/pyodide/", import.meta.url),
);
const pythonVersion = JSON.parse(
  readFileSync(resolve(pythonDirectory, "package.json"), "utf8"),
).version;

// Serve the same pinned, local Python runtime in development and production.
// It is fetched only when the compiler case study is opened.
function compilerRuntime() {
  let outputDirectory;
  return {
    name: "compiler-runtime",
    configResolved(config) {
      outputDirectory = resolve(
        config.root,
        config.build.outDir,
        "runtime/python",
        pythonVersion,
      );
    },
    configureServer(server) {
      server.middlewares.use(
        `/runtime/python/${pythonVersion}`,
        (request, response, next) => {
          const name = new URL(request.url, "http://localhost").pathname.slice(
            1,
          );
          if (!pythonFiles.includes(name)) return next();
          response.setHeader(
            "Content-Type",
            name.endsWith(".mjs")
              ? "text/javascript"
              : name.endsWith(".wasm")
                ? "application/wasm"
                : name.endsWith(".json")
                  ? "application/json"
                  : "application/zip",
          );
          createReadStream(resolve(pythonDirectory, name))
            .on("error", next)
            .pipe(response);
        },
      );
    },
    closeBundle() {
      mkdirSync(outputDirectory, { recursive: true });
      for (const name of pythonFiles)
        copyFileSync(
          resolve(pythonDirectory, name),
          resolve(outputDirectory, name),
        );
    },
  };
}

export default defineConfig({
  define: { __PYODIDE_VERSION__: JSON.stringify(pythonVersion) },
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(), compilerRuntime()],
});
