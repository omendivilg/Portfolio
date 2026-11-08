import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Play,
  X,
} from "@phosphor-icons/react";
import { examples } from "../compiler/examples.js";
import { diagnosticText, tokenName } from "../compiler/tokenNames.js";

const stages = [
  ["lexical", "Tokens"],
  ["syntax", "Syntax tree"],
  ["semantic", "Semantic checks"],
];

export default function CompilerDemo() {
  const [source, setSource] = useState(examples[0].source);
  const [example, setExample] = useState(examples[0].id);
  const [phase, setPhase] = useState("loading");
  const [message, setMessage] = useState(
    "Preparing the compiler for its first run...",
  );
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("diagnostics");
  const worker = useRef(null);
  const timeout = useRef(null);
  const initialize = useRef(null);
  const lineNumbers = useRef(null);
  const editor = useRef(null);

  useEffect(() => {
    const stop = () => {
      clearTimeout(timeout.current);
      worker.current?.terminate();
      worker.current = null;
    };
    const fail = (text) => {
      stop();
      setPhase("error");
      setMessage(text);
    };
    const start = () => {
      stop();
      setPhase("loading");
      setMessage("Preparing the compiler for its first run...");
      const instance = new Worker(
        new URL("../compiler/compiler.worker.js", import.meta.url),
        { type: "module" },
      );
      worker.current = instance;
      instance.onmessage = ({ data }) => {
        if (worker.current !== instance) return;
        clearTimeout(timeout.current);
        if (data.type === "ready") {
          setPhase("ready");
          setMessage("Ready. Edit the code or choose an example.");
        } else if (data.type === "result") {
          setResult(data.result);
          setTab("diagnostics");
          setPhase("ready");
          setMessage(
            data.result.ok
              ? "Compilation successful. All three checks passed."
              : "Compilation finished. Review the diagnostics below.",
          );
        } else {
          fail(
            "The compiler could not load. Check your connection and try again.",
          );
        }
      };
      instance.onerror = (event) => {
        event.preventDefault();
        if (worker.current === instance)
          fail("The compiler could not start. Try loading it again.");
      };
      timeout.current = setTimeout(() => {
        if (worker.current === instance)
          fail(
            "Loading is taking too long. Check your connection and try again.",
          );
      }, 60000);
      instance.postMessage({ type: "initialize" });
    };
    initialize.current = start;
    start();
    return () => {
      initialize.current = null;
      stop();
    };
  }, []);

  const changeSource = (value) => {
    setSource(value);
    setResult(null);
    setTab("diagnostics");
    if (phase === "ready")
      setMessage("Code changed. Compile to see the result.");
  };
  const compile = () => {
    if (
      phase !== "ready" ||
      !source.trim() ||
      source.length > 10000 ||
      !worker.current
    )
      return;
    setPhase("running");
    setResult(null);
    setMessage("Checking tokens, syntax, and semantics...");
    timeout.current = setTimeout(() => {
      worker.current?.terminate();
      worker.current = null;
      setPhase("error");
      setMessage(
        "This input took too long to analyze. Try a smaller program and reload the compiler.",
      );
    }, 5000);
    worker.current.postMessage({ type: "compile", source });
  };
  const loadExample = (sample) => {
    if (!sample) return;
    setExample(sample.id);
    changeSource(sample.source);
    editor.current.scrollTop = 0;
    editor.current.scrollLeft = 0;
    lineNumbers.current.scrollTop = 0;
  };
  const busy = phase === "running";

  return (
    <section className="compiler-demo" aria-labelledby="demo-heading">
      <div className="demo-intro">
        <div>
          <p className="eyebrow">FROM SOURCE TO UNDERSTANDING</p>
          <h3 id="demo-heading">Try the compiler.</h3>
        </div>
        <a
          href="https://github.com/omendivilg/Compilador"
          target="_blank"
          rel="noreferrer"
        >
          View source <ArrowUpRight size={16} />
        </a>
      </div>
      <p className="demo-description">
        Write a little C-like code. See how it becomes tokens, a syntax tree,
        and semantic checks.
      </p>
      <div className="demo-toolbar">
        <label htmlFor="compiler-example">Start with</label>
        <select
          id="compiler-example"
          value={example}
          disabled={busy}
          onChange={(event) => {
            loadExample(
              examples.find((item) => item.id === event.target.value),
            );
          }}
        >
          <option value="" disabled>
            Your code
          </option>
          {examples.map((sample) => (
            <option key={sample.id} value={sample.id}>
              {sample.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="demo-reset"
          disabled={busy}
          onClick={() => {
            loadExample(
              examples.find((item) => item.id === example) ?? examples[0],
            );
          }}
        >
          Reset code
        </button>
      </div>
      <div className="demo-workspace">
        <div className="demo-editor-pane">
          <div className="demo-pane-heading">
            <label htmlFor="compiler-source">Source code</label>
            <span>C-like / editable</span>
          </div>
          <div className="demo-editor">
            <pre className="editor-lines" ref={lineNumbers} aria-hidden="true">
              {source
                .split("\n")
                .map((_, index) => index + 1)
                .join("\n")}
            </pre>
            <textarea
              ref={editor}
              id="compiler-source"
              value={source}
              disabled={busy}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              wrap="off"
              maxLength={10000}
              aria-describedby="compiler-editor-hint"
              onScroll={(event) => {
                lineNumbers.current.scrollTop = event.currentTarget.scrollTop;
              }}
              onChange={(event) => {
                setExample("");
                changeSource(event.target.value);
              }}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  compile();
                }
              }}
            />
          </div>
          <div className="demo-editor-footer">
            <span id="compiler-editor-hint">Ctrl / ⌘ + Enter to compile</span>
            <span>{source.length.toLocaleString()} / 10,000</span>
          </div>
        </div>
        <div className="demo-result-pane">
          <div className="demo-pane-heading">
            <span>Compiler output</span>
            <span>01 → 02 → 03</span>
          </div>
          <ol className="compiler-stages" aria-label="Compilation stages">
            {stages.map(([key, label], index) => (
              <li key={key} data-status={result?.stages[key] ?? "pending"}>
                <span>
                  {result?.stages[key] === "passed" ? (
                    <Check size={13} />
                  ) : result?.stages[key] === "failed" ? (
                    <X size={13} />
                  ) : (
                    `0${index + 1}`
                  )}
                </span>
                {label}
              </li>
            ))}
          </ol>
          <div className="demo-output" aria-busy={phase === "loading" || busy}>
            {!result ? (
              <div className="demo-empty">
                <span className="demo-empty-symbol" aria-hidden="true">
                  {phase === "error" ? "!" : "{ }"}
                </span>
                <h4>
                  {phase === "loading"
                    ? "Getting things ready."
                    : busy
                      ? "Following your code."
                      : phase === "error"
                        ? "Let's try that again."
                        : "Every program has a story."}
                </h4>
                <p>
                  {phase === "loading"
                    ? "The first load takes a moment. After that, your code is checked right here in your browser."
                    : busy
                      ? "The compiler is working through all three stages."
                      : phase === "error"
                        ? message
                        : "Compile your code to see what the language understands, and what needs another look."}
                </p>
              </div>
            ) : (
              <>
                <div
                  className="output-tabs"
                  role="tablist"
                  aria-label="Compiler results"
                >
                  {[
                    ["diagnostics", "Diagnostics"],
                    ["tokens", "Tokens"],
                    ["ast", "Syntax tree"],
                  ].map(([id, label], index, items) => (
                    <button
                      type="button"
                      key={id}
                      role="tab"
                      id={`output-tab-${id}`}
                      aria-selected={tab === id}
                      aria-controls="compiler-output-panel"
                      tabIndex={tab === id ? 0 : -1}
                      onClick={() => setTab(id)}
                      onKeyDown={(event) => {
                        let next;
                        if (event.key === "ArrowRight")
                          next = (index + 1) % items.length;
                        if (event.key === "ArrowLeft")
                          next = (index + items.length - 1) % items.length;
                        if (event.key === "Home") next = 0;
                        if (event.key === "End") next = items.length - 1;
                        if (next !== undefined) {
                          event.preventDefault();
                          setTab(items[next][0]);
                          document
                            .getElementById(`output-tab-${items[next][0]}`)
                            .focus();
                        }
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div
                  role="tabpanel"
                  id="compiler-output-panel"
                  aria-labelledby={`output-tab-${tab}`}
                  tabIndex={0}
                  className="output-panel"
                >
                  {tab === "diagnostics" && (
                    <div
                      className={
                        result.ok ? "diagnostic-success" : "diagnostic-errors"
                      }
                    >
                      <span className="diagnostic-label">
                        {result.ok ? (
                          <>
                            <Check size={18} /> All checks passed
                          </>
                        ) : (
                          <>
                            <X size={18} />{" "}
                            {result.internal
                              ? "Analyzer limitation"
                              : `${result.diagnostics.length} ${result.diagnostics.length === 1 ? "issue" : "issues"} found`}
                          </>
                        )}
                      </span>
                      {result.ok ? (
                        <p>
                          {result.tokenCount} tokens. A valid syntax tree. No
                          semantic errors.
                        </p>
                      ) : (
                        <ul>
                          {result.diagnostics.map((text, i) => (
                            <li key={i}>{diagnosticText(text)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  {tab === "tokens" &&
                    (result.tokens.length ? (
                      <>
                        <p className="output-note">
                          {result.tokenCount} tokens
                          {result.tokenCount > 200
                            ? " · Showing the first 200"
                            : ""}
                        </p>
                        <table className="token-table">
                          <thead>
                            <tr>
                              <th>Lexeme</th>
                              <th>Token</th>
                              <th>Line</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.tokens.map((token, i) => (
                              <tr key={i}>
                                <td>{token.lexeme}</td>
                                <td>{tokenName(token.type)}</td>
                                <td>{token.line}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <p className="output-note">
                        Fix the lexical error to see the token stream.
                      </p>
                    ))}
                  {tab === "ast" &&
                    (result.ast ? (
                      <pre className="syntax-tree">
                        {JSON.stringify(result.ast, null, 2)}
                      </pre>
                    ) : (
                      <p className="output-note">
                        A syntax tree becomes available once lexical and syntax
                        checks pass.
                      </p>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="demo-actions">
        <p
          role="status"
          aria-live="polite"
          className={`demo-status demo-status-${phase}`}
        >
          {message}
        </p>
        {phase === "error" ? (
          <button
            type="button"
            className="button dark compile-button"
            onClick={() => initialize.current?.()}
          >
            Retry loading <ArrowRight size={20} />
          </button>
        ) : (
          <button
            type="button"
            className="button dark compile-button"
            disabled={phase !== "ready" || !source.trim()}
            onClick={compile}
          >
            {phase === "loading"
              ? "Loading compiler"
              : busy
                ? "Compiling"
                : "Compile"}
            <Play size={20} weight="fill" />
          </button>
        )}
      </div>
      <p className="demo-footnote">
        Checks your program without executing it. Supports primitive types,
        functions, classes, loops, and conditions. This is a custom language
        with C-like syntax.
      </p>
    </section>
  );
}
