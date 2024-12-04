const isEdge = (char: string) => char === 'X' || char === 'S';

interface Position {
  x: number;
  y: number;
}

interface Matrix {
  width: number;
  height: number;
  rows: string[];
  canvas: string[][];
  pos: Position;
  total: number;
  totalX: number;
  isAtEnd: () => boolean;
  advance: () => void;
  getPosValue: (pos?: Position, mark?: boolean) => string;
  draw: (pos?: Position) => void;
  scan: () => void;
  scanHorizontally: () => void;
  scanVertically: () => void;
  scanDiagonal: () => void;
  printCanvas: () => void;
  scanX: () => void;
}

const newMatrix: (rows: string[]) => Matrix = (rows) => {
  if (!rows.length || rows.some((row) => row.length !== rows[0].length))
    throw new Error('Invalid input: data is not a rectangle');

  const canvas = rows.map((row) => row.split('').map(() => '.'));

  const m: Matrix = {
    rows,
    width: rows[0].length - 1,
    height: rows.length - 1,
    pos: { x: 0, y: 0 },
    total: 0,
    totalX: 0,
    canvas,
    isAtEnd: () => m.pos.x >= m.width && m.pos.y >= m.height,
    advance: () => {
      if (m.pos.x < m.width) {
        m.pos.x++;
        return;
      }
      m.pos.x = 0;
      m.pos.y++;
    },

    getPosValue: (pos = m.pos) => m.rows[pos.y][pos.x],

    draw: (pos = m.pos) => {
      m.canvas[pos.y][pos.x] = m.rows[pos.y][pos.x];
    },

    scan: () => {
      while (!m.isAtEnd()) {
        if (isEdge(m.getPosValue())) {
          m.scanHorizontally();
          m.scanVertically();
          m.scanDiagonal();
        }

        if (m.getPosValue() === 'A') {
          m.scanX();
        }

        m.advance();
      }
    },

    scanHorizontally: () => {
      if (m.pos.x + 3 > m.width) return;

      const word = m.rows[m.pos.y].substring(m.pos.x, m.pos.x + 4);
      if (word === 'XMAS' || word === 'SAMX') {
        m.total++;
        m.draw(m.pos);
        m.draw({ x: m.pos.x + 1, y: m.pos.y });
        m.draw({ x: m.pos.x + 2, y: m.pos.y });
        m.draw({ x: m.pos.x + 3, y: m.pos.y });
      }
    },

    scanVertically: () => {
      if (m.pos.y + 3 > m.height) return;
      const word =
        m.getPosValue() +
        m.getPosValue({ ...m.pos, y: m.pos.y + 1 }) +
        m.getPosValue({ ...m.pos, y: m.pos.y + 2 }) +
        m.getPosValue({ ...m.pos, y: m.pos.y + 3 });

      if (word === 'XMAS' || word === 'SAMX') {
        m.total++;
        m.draw(m.pos);
        m.draw({ x: m.pos.x, y: m.pos.y + 1 });
        m.draw({ x: m.pos.x, y: m.pos.y + 2 });
        m.draw({ x: m.pos.x, y: m.pos.y + 3 });
      }
    },

    scanDiagonal: () => {
      if (m.pos.x + 3 <= m.width && m.pos.y + 3 <= m.height) {
        let word =
          m.getPosValue() +
          m.getPosValue({ x: m.pos.x + 1, y: m.pos.y + 1 }) +
          m.getPosValue({ x: m.pos.x + 2, y: m.pos.y + 2 }) +
          m.getPosValue({ x: m.pos.x + 3, y: m.pos.y + 3 });
        if (word === 'XMAS' || word === 'SAMX') {
          m.total++;
          m.draw(m.pos);
          m.draw({ x: m.pos.x + 1, y: m.pos.y + 1 });
          m.draw({ x: m.pos.x + 2, y: m.pos.y + 2 });
          m.draw({ x: m.pos.x + 3, y: m.pos.y + 3 });
        }
      }

      if (m.pos.x - 3 >= 0 && m.pos.y + 3 <= m.height) {
        const word =
          m.getPosValue() +
          m.getPosValue({ x: m.pos.x - 1, y: m.pos.y + 1 }) +
          m.getPosValue({ x: m.pos.x - 2, y: m.pos.y + 2 }) +
          m.getPosValue({ x: m.pos.x - 3, y: m.pos.y + 3 });
        if (word === 'XMAS' || word === 'SAMX') {
          m.total++;
          m.draw(m.pos);
          m.draw({ x: m.pos.x - 1, y: m.pos.y + 1 });
          m.draw({ x: m.pos.x - 2, y: m.pos.y + 2 });
          m.draw({ x: m.pos.x - 3, y: m.pos.y + 3 });
        }
      }
    },

    scanX: () => {
      if (
        m.pos.x <= 0 ||
        m.pos.x >= m.width ||
        m.pos.y <= 0 ||
        m.pos.y >= m.height
      )
        return;

      let word =
        m.getPosValue({ x: m.pos.x + 1, y: m.pos.y - 1 }) +
        m.getPosValue() +
        m.getPosValue({ x: m.pos.x - 1, y: m.pos.y + 1 });

      if (word !== 'MAS' && word !== 'SAM') return;

      word =
        m.getPosValue({ x: m.pos.x - 1, y: m.pos.y - 1 }) +
        m.getPosValue() +
        m.getPosValue({ x: m.pos.x + 1, y: m.pos.y + 1 });

      if (word !== 'MAS' && word !== 'SAM') return;

      m.totalX++;
    },

    printCanvas: () => m.canvas.forEach((row) => console.log(row.join(''))),
  };

  return m;
};

export function part1(input: string): number {
  const puzzle = newMatrix(input.split('\r\n'));

  puzzle.scan();
  // puzzle.printCanvas();

  return puzzle.total;
}

export function part2(input: string): number {
  const puzzle = newMatrix(input.split('\r\n'));

  puzzle.scan();

  return puzzle.totalX;
}
