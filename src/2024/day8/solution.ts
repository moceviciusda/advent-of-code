const isDigit = (c: string) => {
  return c.length === 1 && c >= '0' && c <= '9';
};

const isAlpha = (c: string) => {
  return c.length === 1 && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'));
};

const isAlphaNumeric = (c: string) => {
  return isAlpha(c) || isDigit(c);
};

interface Position {
  x: number;
  y: number;
}

interface Grid {
  height: number;
  width: number;
  antennas: Map<string, Position[]>;
  antinodes: Position[];

  print: () => void;
}

const parseInput = (input: string): Grid => {
  const lines = input.split('\r\n');

  const grid: Grid = {
    height: lines.length - 1,
    width: lines[0].length - 1,
    antennas: new Map(),
    antinodes: [],

    print: function () {
      for (let y = 0; y <= this.height; y++) {
        let line = '';
        for (let x = 0; x <= this.width; x++) {
          if (this.antennas.has(lines[y][x])) {
            line += lines[y][x];
            continue;
          }

          if (this.antinodes.some((p) => p.x === x && p.y === y)) {
            line += '#';
            continue;
          }

          line += '.';
        }
        console.log(line);
      }
    },
  };

  lines.forEach((line, y) => {
    line.split('').forEach((char, x) => {
      if (!isAlphaNumeric(char)) return;

      const antennas = grid.antennas.get(char);
      !antennas ? grid.antennas.set(char, [{ x, y }]) : antennas.push({ x, y });
    });
  });

  return grid;
};

const getAntinodePos = (
  pos1: Position,
  pos2: Position
): [Position, Position] => {
  const antiNode1: Position = {
    x: pos1.x + (pos1.x - pos2.x),
    y: pos1.y + (pos1.y - pos2.y),
  };
  const antiNode2: Position = {
    x: pos2.x + (pos2.x - pos1.x),
    y: pos2.y + (pos2.y - pos1.y),
  };

  return [antiNode1, antiNode2];
};

const inBounds = (pos: Position, grid: Grid): boolean =>
  pos.x >= 0 && pos.x <= grid.width && pos.y >= 0 && pos.y <= grid.height;

const getAntinodePosResonant = (
  pos1: Position,
  pos2: Position,
  grid: Grid
): Position[] => {
  const stepX1 = pos1.x - pos2.x;
  const stepY1 = pos1.y - pos2.y;
  const stepX2 = pos2.x - pos1.x;
  const stepY2 = pos2.y - pos1.y;

  const positions: Position[] = [];

  const anti1: Position = structuredClone(pos1);

  while (inBounds(anti1, grid)) {
    positions.push(structuredClone(anti1));
    anti1.x += stepX1;
    anti1.y += stepY1;
  }

  const anti2: Position = structuredClone(pos2);

  while (inBounds(anti2, grid)) {
    positions.push(structuredClone(anti2));
    anti2.x += stepX2;
    anti2.y += stepY2;
  }

  return positions;
};

export function part1(input: string): number {
  const grid = parseInput(input);

  grid.antennas.forEach((positions) => {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const antiPositions = getAntinodePos(positions[i], positions[j]);
        const valid = antiPositions.filter(
          (pos) =>
            inBounds(pos, grid) &&
            !grid.antinodes.some((p) => p.x === pos.x && p.y === pos.y)
        );

        grid.antinodes.push(...valid);
      }
    }
  });

  return grid.antinodes.length;
}

export function part2(input: string): number {
  const grid = parseInput(input);

  grid.antennas.forEach((positions) => {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const antiPositions = getAntinodePosResonant(
          positions[i],
          positions[j],
          grid
        );
        const valid = antiPositions.filter(
          (pos) => !grid.antinodes.some((p) => p.x === pos.x && p.y === pos.y)
        );

        grid.antinodes.push(...valid);
      }
    }
  });

  return grid.antinodes.length;
}
