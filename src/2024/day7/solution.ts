interface Tree {
  value: number;
  add: Tree | null;
  mul: Tree | null;
  concat: Tree | null;
}

interface Equation {
  testVal: number;
  results: number[];
  tree: Tree;
}

const traverseTree = (eq: Equation, acc: number, allowConcat: boolean) => {
  if (eq.tree.add === null || eq.tree.mul === null) {
    eq.results.push(acc);
  } else {
    traverseTree(
      { ...eq, tree: eq.tree.add },
      acc + eq.tree.add.value,
      allowConcat
    );
    traverseTree(
      { ...eq, tree: eq.tree.mul },
      acc * eq.tree.mul.value,
      allowConcat
    );
    allowConcat &&
      traverseTree(
        { ...eq, tree: eq.tree.mul },
        Number(acc.toString() + eq.tree.concat?.value.toString()),
        allowConcat
      );
  }
};

const newTree: (numbers: number[]) => Tree = (numbers) => {
  if (numbers.length <= 1) {
    return {
      value: numbers[0],
      add: null,
      mul: null,
      concat: null,
    };
  }

  const [first, ...rest] = numbers;

  return {
    value: first,
    add: newTree(rest),
    mul: newTree(rest),
    concat: newTree(rest),
  };
};

const parseInput = (input: string): Equation[] => {
  const lines = input.split('\r\n');

  const equations: Equation[] = [];

  for (const line of lines) {
    const [testVal, numbers] = line.split(': ');
    if (typeof testVal === 'undefined' || typeof numbers === 'undefined')
      throw new Error('corrupted input');

    equations.push({
      testVal: Number(testVal),
      results: [],
      tree: newTree(numbers.split(' ').map(Number)),
    });
  }

  return equations;
};

export function part1(input: string): number {
  let totalResult = 0;

  const equations = parseInput(input);

  equations.forEach((eq) => {
    traverseTree(eq, eq.tree.value, false);
    if (eq.results.includes(eq.testVal)) totalResult += eq.testVal;
  });

  return totalResult;
}

export function part2(input: string): number {
  let totalResult = 0;

  const equations = parseInput(input);

  equations.forEach((eq) => {
    traverseTree(eq, eq.tree.value, true);
    if (eq.results.includes(eq.testVal)) totalResult += eq.testVal;
  });

  return totalResult;
}
