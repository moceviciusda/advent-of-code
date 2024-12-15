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

export function part1(input: string): number {
  const plantRegions = parseInput(input);

  let totalPrice = 0;

  plantRegions.forEach((plant) => {
    plant.forEach((region) => {
      let totalFences = 0;

      const calculateFences = (pos: Position) => {
        const neighbors = region.filter((p) => {
          const horizontalNeighbor =
            p.y === pos.y && (p.x === pos.x - 1 || p.x === pos.x + 1);
          const verticalNeighbor =
            p.x === pos.x && (p.y === pos.y - 1 || p.y === pos.y + 1);

          return horizontalNeighbor || verticalNeighbor;
        });

        return 4 - neighbors.length;
      };

      region.forEach((pos) => {
        totalFences += calculateFences(pos);
      });

      totalPrice += region.length * totalFences;
    });
  });

  return totalPrice;
}

export function part2(input: string): number {
  return 0;
}
