interface TMap {
  width: number;
  height: number;
  rows: string[];

  getPosHeight: (pos: Position) => number;
}

interface Position {
  x: number;
  y: number;
}

const isOutOfBounds = (map: TMap, position: Position): boolean => {
  return (
    position.x < 0 ||
    position.x > map.width ||
    position.y < 0 ||
    position.y > map.height
  );
};

const parseInput = (input: string): TMap => {
  const rows = input.split('\r\n');

  if (!rows.length) throw new Error('invalid input');

  const map: TMap = {
    rows,
    width: rows[0].length - 1,
    height: rows.length - 1,

    getPosHeight: (pos) => {
      if (isOutOfBounds(map, pos)) throw new Error('position out of bounds');
      return Number(map.rows[pos.y][pos.x]);
    },
  };

  return map;
};

const findTrailheads = (map: TMap): Position[] => {
  const trailheads: Position[] = [];

  for (let y = 0; y < map.rows.length; y++) {
    for (let x = 0; x < map.rows[y].length; x++) {
      if (map.getPosHeight({ x, y }) === 0) trailheads.push({ x, y });
    }
  }
  return trailheads;
};

const getValidSteps = (map: TMap, pos: Position): Position[] => {
  const validHeight = map.getPosHeight(pos) + 1;

  const validSteps: Position[] = [];

  const left = { ...pos, x: pos.x - 1 };
  if (!isOutOfBounds(map, left) && map.getPosHeight(left) === validHeight) {
    validSteps.push(left);
  }

  const right = { ...pos, x: pos.x + 1 };
  if (!isOutOfBounds(map, right) && map.getPosHeight(right) === validHeight) {
    validSteps.push(right);
  }

  const up = { ...pos, y: pos.y - 1 };
  if (!isOutOfBounds(map, up) && map.getPosHeight(up) === validHeight) {
    validSteps.push(up);
  }

  const down = { ...pos, y: pos.y + 1 };
  if (!isOutOfBounds(map, down) && map.getPosHeight(down) === validHeight) {
    validSteps.push(down);
  }

  return validSteps;
};

export function part1(input: string): number {
  const map = parseInput(input);
  const trailheads = findTrailheads(map);

  let totalScore = 0;

  trailheads.forEach((th) => {
    const reachableEnds: Position[] = [];

    const walkTrail = (pos: Position) => {
      if (
        map.getPosHeight(pos) === 9 &&
        !reachableEnds.some((p) => p.x === pos.x && p.y === pos.y)
      ) {
        reachableEnds.push(pos);
        return;
      }

      const validSteps = getValidSteps(map, pos);
      if (!validSteps.length) return;

      validSteps.forEach((pos) => {
        walkTrail(pos);
      });
    };

    walkTrail(th);
    totalScore += reachableEnds.length;
  });

  return totalScore;
}

export function part2(input: string): number {
  return 0;
}
