import adapter from "./adapter.py?raw";

const revision = "668f79c63591e325bdad5bbdc2bb5fbdd92bbb5e";
const modules = [
  "tokens.py",
  "ast_nodes.py",
  "analizador_lexico.py",
  "parser.py",
  "analizador_semantico.py",
];
let runtime;

async function initialize() {
  const indexURL = new URL(
    `/runtime/python/${__PYODIDE_VERSION__}/`,
    self.location.origin,
  ).href;
  const [{ loadPyodide }, sources] = await Promise.all([
    import(/* @vite-ignore */ `${indexURL}pyodide.mjs`),
    Promise.all(
      modules.map(async (name) => {
        const response = await fetch(`/compiler/${revision}/${name}`);
        if (!response.ok) throw new Error(`Unable to load ${name}`);
        return [name, await response.text()];
      }),
    ),
  ]);
  const python = await loadPyodide({ indexURL });
  python.FS.mkdir("/portfolio_compiler");
  sources.forEach(([name, source]) =>
    python.FS.writeFile(`/portfolio_compiler/${name}`, source),
  );
  python.runPython('import sys\nsys.path.insert(0, "/portfolio_compiler")');
  await python.runPythonAsync(adapter);
  return python;
}

self.onmessage = async ({ data }) => {
  try {
    runtime ??= initialize();
    const python = await runtime;
    if (data.type === "initialize") {
      self.postMessage({ type: "ready" });
    } else if (data.type === "compile") {
      const compile = python.globals.get("compile_source");
      try {
        // Source is a function argument, never interpolated into Python code.
        const result = JSON.parse(compile(data.source));
        self.postMessage({ type: "result", result });
      } finally {
        compile.destroy();
      }
    }
  } catch {
    runtime = undefined;
    self.postMessage({ type: "error" });
  }
};
