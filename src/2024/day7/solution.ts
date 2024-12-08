interface Equation {
  testVal: number;
  numbers: number[];
}

const parseInput = (input: string): Equation[] => {
  const lines = input.split('\r\n');

  const equations: Equation[] = [];

  for (const line of lines) {
    const [testVal, numbers] = line.split(': ');
    if (typeof testVal === 'undefined' || typeof numbers === 'undefined')
      throw new Error('corrupted input');

    equations.push({
      testVal: Number(testVal),
      numbers: numbers.split(' ').map(Number),
    });
  }

  return equations;
};

export function part1(input: string): number {
  let totalResult = 0;

  const equations = parseInput(input);

  return totalResult;
}

export function part2(input: string): number {
  return 0;
}
