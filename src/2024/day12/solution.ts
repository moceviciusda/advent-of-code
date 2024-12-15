interface Position {
  x: number;
  y: number;
}

type Region = Position[];

const parseInput = (input: string) => {
  const regions: Map<string, Region[]> = new Map();

  const rows = input.split('\r\n');
  const grid: (string | null)[][] = rows.map((row) => row.split(''));

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const startingPlantNmae = grid[y][x];

      if (!startingPlantNmae) continue;

      const region: Region = [];
      const walk = (pos: Position) => {
        const plantName = grid[pos.y]?.[pos.x];
        if (!plantName || plantName !== startingPlantNmae) return;

        region.push(pos);
        grid[pos.y][pos.x] = null;

        walk({ ...pos, x: pos.x - 1 });
        walk({ ...pos, y: pos.y - 1 });
        walk({ ...pos, x: pos.x + 1 });
        walk({ ...pos, y: pos.y + 1 });
      };

      walk({ x, y });

      const plantRegions = regions.get(startingPlantNmae);
      if (!plantRegions) {
        regions.set(startingPlantNmae, [region]);
        continue;
      }

      plantRegions.push(region);
    }
  }

  return regions;
};

const calculateFences = (pos: Position, region: Region) => {
  const neighbors = region.filter((p) => {
    const horizontalNeighbor =
      p.y === pos.y && (p.x === pos.x - 1 || p.x === pos.x + 1);
    const verticalNeighbor =
      p.x === pos.x && (p.y === pos.y - 1 || p.y === pos.y + 1);

    return horizontalNeighbor || verticalNeighbor;
  });

  return 4 - neighbors.length;
};

export function part1(input: string): number {
  const plants = parseInput(input);

  let totalPrice = 0;

  plants.forEach((regions) => {
    regions.forEach((region) => {
      let totalFences = 0;

      region.forEach((pos) => {
        totalFences += calculateFences(pos, region);
      });

      totalPrice += region.length * totalFences;
    });
  });

  return totalPrice;
}

enum Direction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  UP = 'UP',
}

interface Edge extends Position {
  dir: Direction;
}

const getEdges = (pos: Position, region: Region): Edge[] => {
  const edges: Edge[] = [];

  const topNeighbor = region.some((p) => p.x === pos.x && p.y === pos.y - 1);
  if (!topNeighbor) {
    edges.push({ x: pos.x, y: pos.y, dir: Direction.UP });
  }
  const bottomNeighbor = region.some((p) => p.x === pos.x && p.y === pos.y + 1);
  if (!bottomNeighbor) {
    edges.push({ x: pos.x, y: pos.y, dir: Direction.DOWN });
  }
  const leftNeighbor = region.some((p) => p.y === pos.y && p.x === pos.x - 1);
  if (!leftNeighbor) {
    edges.push({ x: pos.x, y: pos.y, dir: Direction.LEFT });
  }
  const rightNeighbor = region.some((p) => p.y === pos.y && p.x === pos.x + 1);
  if (!rightNeighbor) {
    edges.push({ x: pos.x, y: pos.y, dir: Direction.RIGHT });
  }

  return edges;
};

const calculateSides = (edges: Edge[]): number => {
  let sides = 0;

  let newEdges = [...edges];

  const walk = (edge: Edge) => {
    newEdges = newEdges.filter((e) => edge !== e);

    switch (edge.dir) {
      case Direction.LEFT:
      case Direction.RIGHT:
        const up = newEdges.find(
          (e) => e.dir === edge.dir && edge.x === e.x && edge.y === e.y - 1
        );
        up && walk(up);
        const down = newEdges.find(
          (e) => e.dir === edge.dir && edge.x === e.x && edge.y === e.y + 1
        );
        down && walk(down);

      case Direction.DOWN:
      case Direction.UP:
        const left = newEdges.find(
          (e) => e.dir === edge.dir && edge.y === e.y && edge.x === e.x - 1
        );
        left && walk(left);
        const right = newEdges.find(
          (e) => e.dir === edge.dir && edge.y === e.y && edge.x === e.x + 1
        );
        right && walk(right);
    }
  };

  while (!!newEdges.length) {
    walk(newEdges[0]);
    sides++;
  }

  return sides;
};

export function part2(input: string): number {
  const plants = parseInput(input);

  let totalPrice = 0;

  plants.forEach((regions) => {
    regions.forEach((region) => {
      const edges: Edge[] = [];

      region.forEach((pos) => {
        edges.push(...getEdges(pos, region));
      });

      totalPrice += region.length * calculateSides(edges);
    });
  });

  return totalPrice;
}
