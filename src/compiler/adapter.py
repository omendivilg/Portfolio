"""Browser interface for Oscar's original compiler. Does not execute source code."""

import contextlib
import io
import json
from dataclasses import fields, is_dataclass

from analizador_lexico import Lexer, LexError
from parser import Parser, ParserError
from analizador_semantico import SemanticAnalyzer
from tokens import Token, TokenType


def syntax_tree(root):
    remaining = 250

    def visit(value, depth=0):
        nonlocal remaining
        remaining -= 1
        if remaining < 0 or depth > 14:
            return "..."
        if isinstance(value, Token):
            return value.lexeme
        if isinstance(value, list):
            return [visit(item, depth + 1) for item in value[:80]]
        if is_dataclass(value):
            return {
                "node": type(value).__name__,
                **{field.name: visit(getattr(value, field.name), depth + 1)
                   for field in fields(value)},
            }
        if isinstance(value, (str, int, float, bool)) or value is None:
            return value
        return str(value)

    return visit(root)


def compile_source(source):
    result = {
        "ok": False,
        "stages": {"lexical": "pending", "syntax": "pending", "semantic": "pending"},
        "diagnostics": [],
        "tokens": [],
        "tokenCount": 0,
        "ast": None,
        "internal": False,
    }
    stage = "lexical"
    try:
        if not source.strip():
            raise LexError("Write a program or choose an example first.")
        if len(source) > 10000:
            raise LexError("This playground supports up to 10,000 characters.")
        tokens = Lexer(source).scan_tokens()
        visible_tokens = [token for token in tokens
                          if token.type not in (TokenType.BOF, TokenType.EOF)]
        result["tokenCount"] = len(visible_tokens)
        result["tokens"] = [
            {"type": token.type.name, "lexeme": token.lexeme,
             "line": token.line, "column": token.column}
            for token in visible_tokens[:200]
        ]
        if len(tokens) > 2500:
            raise LexError("This program is too large for the playground. Try a smaller example.")
        result["stages"][stage] = "passed"
        stage = "syntax"
        ast = Parser(tokens).parse()
        result["ast"] = syntax_tree(ast)
        result["stages"][stage] = "passed"
        stage = "semantic"
        # The original analyzer catches some internal errors rather than raising
        # them. Capture stderr so an internal traceback cannot appear as success.
        stdout, stderr = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            errors = SemanticAnalyzer().analyze(ast)
        if stderr.getvalue():
            result["internal"] = True
            result["diagnostics"] = [
                "This input reached an unsupported case in the original analyzer. Try a simpler example."
            ]
        else:
            result["diagnostics"] = errors
        result["ok"] = not result["diagnostics"]
        result["stages"][stage] = "passed" if result["ok"] else "failed"
    except (LexError, ParserError) as error:
        result["stages"][stage] = "failed"
        result["diagnostics"] = [str(error)]
    except RecursionError:
        result["stages"][stage] = "failed"
        result["diagnostics"] = ["This expression is too deeply nested. Try a simpler program."]
    except Exception:
        result["stages"][stage] = "failed"
        result["internal"] = True
        result["diagnostics"] = [
            "The original compiler could not analyze this input. Try one of the examples."
        ]
    return json.dumps(result)
