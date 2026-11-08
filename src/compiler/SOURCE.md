# Compiler source

The five Python modules in `public/compiler/668f79c63591e325bdad5bbdc2bb5fbdd92bbb5e/` are vendored from [Oscar's Compilador repository](https://github.com/omendivilg/Compilador/tree/668f79c63591e325bdad5bbdc2bb5fbdd92bbb5e).
They retain the original implementation, names, and comments.
Make changes to the compiler upstream and import a new pinned revision rather than patching this snapshot.

- `tokens.py`: token types and source locations.
- `analizador_lexico.py`: lexical analysis.
- `ast_nodes.py`: abstract syntax tree nodes.
- `parser.py`: recursive-descent parsing.
- `analizador_semantico.py`: scopes, symbol lookup, and type checks.

`adapter.py` is the portfolio's browser interface.
It calls the original lexer, parser, and semantic analyzer with fresh instances for every run.
It serializes diagnostics, a bounded token list, and a bounded syntax tree.
It captures analyzer tracebacks so an internal failure cannot be reported as success.
Submitted source is passed as a string argument and is never evaluated as Python.
The compiler does not generate executable code or run the submitted program.

`compiler.worker.js` loads the pinned local Pyodide runtime and Python source files only after the compiler case study is opened.
The build and development server use the same files from the exact npm dependency.
The UI terminates the worker after a loading failure, an analysis timeout, or closing the case study.
`tokenNames.js` translates token enum display names to English without changing the original Python modules.

The examples use the custom grammar, which resembles C but is not a complete implementation of C or C++.
Diagnostic wording comes from the compiler; the display removes Python enum prefixes and translates token names to English.
