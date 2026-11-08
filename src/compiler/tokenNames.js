// Display names are English; the original Python token enums remain intact.
const names = {
  OP_SUMA: "PLUS",
  OP_RESTA: "MINUS",
  OP_MULT: "MULTIPLY",
  OP_DIV: "DIVIDE",
  OP_MOD: "MODULO",
  OP_INC: "INCREMENT",
  OP_DEC: "DECREMENT",
  OP_MENOR: "LESS_THAN",
  OP_MENOR_IG: "LESS_OR_EQUAL",
  OP_MAYOR: "GREATER_THAN",
  OP_MAYOR_IG: "GREATER_OR_EQUAL",
  OP_IGUAL: "EQUAL",
  OP_DISTINTO: "NOT_EQUAL",
  OP_AND: "AND",
  OP_OR: "OR",
  OP_NOT: "NOT",
  OP_ASIG: "ASSIGN",
  PAREN_IZQ: "LEFT_PAREN",
  PAREN_DER: "RIGHT_PAREN",
  LLAVE_IZQ: "LEFT_BRACE",
  LLAVE_DER: "RIGHT_BRACE",
  CORCHETE_IZQ: "LEFT_BRACKET",
  CORCHETE_DER: "RIGHT_BRACKET",
  PUNTO_COMA: "SEMICOLON",
  COMA: "COMMA",
  PUNTO: "DOT",
  ID: "IDENTIFIER",
  NUM_INT: "INTEGER_LITERAL",
  NUM_FLOAT: "FLOAT_LITERAL",
};

export const tokenName = (type) => names[type] ?? type;

export const diagnosticText = (text) =>
  text
    .replace(/\bTypeKind\.([A-Z]+)\b/g, (_, type) => type.toLowerCase())
    .replace(/\bTokenType\.([A-Z_]+)\b/g, (_, type) => tokenName(type));
