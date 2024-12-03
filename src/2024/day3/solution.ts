const isDigit = (c: string) => {
  return c.length === 1 && c >= '0' && c <= '9';
};

const isAlpha = (c: string) => {
  return (
    c.length === 1 &&
    ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_')
  );
};

const isAlphaNumeric = (c: string) => {
  return isAlpha(c) || isDigit(c);
};

enum TokenType {
  COMMA,
  LEFT_PAREN,
  RIGT_PAREN,

  IDENTIFIER,
  NUMBER,

  MUL,

  UNSUPPORTED,

  EOF,
}

interface Token {
  type: TokenType;
  lexeme: string;
  literal?: number;
}

interface Scanner {
  input: string;
  start: number;
  current: number;
  line: number;
  tokens: Token[];
  keywords: Map<string, TokenType>;
  advance: () => string;
  isAtEnd: () => boolean;
  peek: () => string;
  addToken: (type: TokenType, literal?: number) => void;
  scanTokens: () => Token[];
  scanToken: () => void;
  number: () => void;
  identifier: () => void;
}

function newScanner(input: string): Scanner {
  const keywords = new Map<string, TokenType>();
  keywords.set('mul', TokenType.MUL);

  const scanner: Scanner = {
    input,
    start: 0,
    current: 0,
    line: 1,
    tokens: [],
    keywords,
    advance: () => scanner.input[scanner.current++],
    isAtEnd: () => scanner.current >= scanner.input.length,
    peek: () => (scanner.isAtEnd() ? '\0' : scanner.input[scanner.current]),

    addToken: (type: TokenType, literal?: number) => {
      const lexeme = scanner.input.substring(scanner.start, scanner.current);
      scanner.tokens.push({ type, lexeme, literal });
    },

    scanTokens: () => {
      while (!scanner.isAtEnd()) {
        scanner.start = scanner.current;
        scanner.scanToken();
      }

      scanner.addToken(TokenType.EOF);
      return scanner.tokens;
    },

    scanToken: () => {
      const c = scanner.advance();
      switch (c) {
        case '\n':
          scanner.line++;
          break;
        case '(':
          scanner.addToken(TokenType.LEFT_PAREN);
          break;
        case ')':
          scanner.addToken(TokenType.RIGT_PAREN);
          break;
        case ',':
          scanner.addToken(TokenType.COMMA);
          break;
        default:
          if (isDigit(c)) {
            scanner.number();
            break;
          } else if (isAlpha(c)) {
            scanner.identifier();
            break;
          }

          scanner.addToken(TokenType.UNSUPPORTED);
          break;
      }
    },

    number: () => {
      while (isDigit(scanner.peek())) scanner.advance();

      if (scanner.current - scanner.start <= 3) {
        const value = Number(
          scanner.input.substring(scanner.start, scanner.current)
        );
        scanner.addToken(TokenType.NUMBER, value);
      }
    },

    identifier: () => {
      while (isAlphaNumeric(scanner.peek())) scanner.advance();

      const lexeme = scanner.input.substring(scanner.start, scanner.current);
      if (lexeme.endsWith('mul')) scanner.addToken(TokenType.MUL);

      // let tokenType = scanner.keywords.get(lexeme);
      // if (!tokenType) tokenType = TokenType.IDENTIFIER;
      // scanner.addToken(tokenType);
    },
  };

  return scanner;
}

export function part1(input: string): number {
  const scanner = newScanner(input);
  const tokens = scanner.scanTokens();

  let sum: number = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== TokenType.MUL) continue;
    if (tokens[i + 1].type !== TokenType.LEFT_PAREN) continue;
    if (tokens[i + 2].type !== TokenType.NUMBER) continue;
    if (tokens[i + 3].type !== TokenType.COMMA) continue;
    if (tokens[i + 4].type !== TokenType.NUMBER) continue;
    if (tokens[i + 5].type !== TokenType.RIGT_PAREN) continue;

    const n1 = tokens[i + 2].literal;
    const n2 = tokens[i + 4].literal;
    if (typeof n1 !== 'number' || typeof n2 !== 'number')
      throw new Error('Invalid number');

    sum += n1 * n1;
  }

  return sum;
}

export function part2(input: string): number {
  return 0;
}
