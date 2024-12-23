enum MapItem {
  empty = '.',
  obstruction = '#',
  mark = 'X',
}

const isMapItem = (input: unknown): input is MapItem => {
  return typeof input === 'string' && ['.', '#', 'X'].includes(input);
};

type LabMap = MapItem[][];

interface Position {
  x: number;
  y: number;
}

interface Lab {
  height: number;
  width: number;
  map: LabMap;

  guardPos: Position;
  guardDir: Direction;
  guardPath: (Position & { dir: Direction })[];

  walk: () => void;
  hasLeft: () => boolean;
  peek: () => MapItem | undefined;
  rotate: () => void;
  advance: () => void;
  markPos: () => void;
  isLoop: () => boolean;

  printMap: () => void;
  reset: () => void;
}

enum Direction {
  up,
  right,
  down,
  left,
}

const newLab = (map: LabMap, guardPos: Position): Lab => {
  const lab: Lab = {
    height: map.length - 1,
    width: map[0].length - 1,
    map: structuredClone(map),

    guardPos: structuredClone(guardPos),
    guardDir: Direction.up,
    guardPath: [],

    walk: () => {
      while (!lab.hasLeft() && !lab.isLoop()) {
        lab.markPos();
        lab.advance();
      }
    },

    hasLeft: () =>
      lab.guardPos.x < 0 ||
      lab.guardPos.x > lab.width ||
      lab.guardPos.y > lab.height ||
      lab.guardPos.y < 0,

    peek: () =>
      lab.map[
        ![Direction.down, Direction.up].includes(lab.guardDir)
          ? lab.guardPos.y
          : lab.guardDir === Direction.down
          ? lab.guardPos.y + 1
          : lab.guardPos.y - 1
      ]?.[
        ![Direction.right, Direction.left].includes(lab.guardDir)
          ? lab.guardPos.x
          : lab.guardDir === Direction.right
          ? lab.guardPos.x + 1
          : lab.guardPos.x - 1
      ],

    rotate: () => {
      if (lab.guardDir === Direction.left) {
        lab.guardDir = Direction.up;
      } else lab.guardDir++;
    },

    advance: () => {
      while (lab.peek() === MapItem.obstruction) lab.rotate();

      switch (lab.guardDir) {
        case Direction.up:
          lab.guardPos.y -= 1;
          return;
        case Direction.right:
          lab.guardPos.x++;
          return;
        case Direction.down:
          lab.guardPos.y++;
          return;
        case Direction.left:
          lab.guardPos.x -= 1;
          return;
      }
    },

    markPos: () => {
      lab.guardPath.push({ ...lab.guardPos, dir: lab.guardDir });
    },

    isLoop: () =>
      lab.guardPath.some(
        (pos) =>
          pos.x === lab.guardPos.x &&
          pos.y === lab.guardPos.y &&
          pos.dir === lab.guardDir
      ),

    printMap: () => {
      const marked = structuredClone(lab.map);

      lab.guardPath.forEach((mark) => {
        marked[mark.y][mark.x] = MapItem.mark;
      });

      console.log('Lab map:');
      marked.forEach((row) => console.log(row.join('')));
    },

    reset: () => {
      lab.map = structuredClone(map);
      lab.guardDir = Direction.up;
      lab.guardPos = structuredClone(guardPos);
      lab.guardPath = [];
    },
  };

  return lab;
};

const parseInput = (input: string): Lab => {
  const data = input.split('\r\n');

  const map: LabMap = [];
  let guardPos: Position | null = null;

  for (let y = 0; y < data.length; y++) {
    map.push([]);
    for (let x = 0; x < data[y].length; x++) {
      if (data[y][x] === '^') {
        guardPos = { x, y };
        map[y].push(MapItem.empty);
        continue;
      }

      const char = data[y][x];
      if (!isMapItem(char))
        throw new Error('corrupted input: invalid character - ' + char);

      map[y].push(char);
    }
  }

  if (!guardPos) throw new Error('corrupted input: guard not found in input');

  const lab = newLab(map, guardPos);

  return lab;
};

export function part1(input: string): number {
  const lab = parseInput(input);

  lab.walk();
  lab.printMap();

  const distinctPositions: Position[] = [];

  lab.guardPath.forEach((pos) => {
    if (!distinctPositions.find((dp) => dp.x === pos.x && dp.y === pos.y)) {
      distinctPositions.push(pos);
    }
  });

  return distinctPositions.length;
}

export function part2(input: string): number {
  const lab = parseInput(input);

  lab.walk();
  const originalPath = structuredClone(lab.guardPath);

  let loopOptions = 0;

  for (let y = 0; y < lab.map.length; y++) {
    for (let x = 0; x < lab.map[y].length; x++) {
      // NOTE: skip placing obstructions where guard will never go
      if (!originalPath.some((pos) => pos.x === x && pos.y === y)) continue;

      lab.reset();
      lab.map[y][x] = MapItem.obstruction;

      lab.walk();
      if (lab.isLoop()) loopOptions++;
    }
  }

  return loopOptions;
}
