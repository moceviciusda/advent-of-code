const parseInput = (input: string): number[] => {
  const sNumbers = input.split(' ');

  const numbers = sNumbers.map(Number);
  return numbers;
};

const blink = (numbers: number[]): void => {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === 0) {
      numbers[i] = 1;
      continue;
    }

    const sNum = numbers[i].toString();
    if (sNum.length % 2 === 0) {
      const firstHalf = Number(sNum.substring(0, sNum.length / 2));
      const secondHalf = Number(sNum.substring(sNum.length / 2));

      numbers[i] = firstHalf;
      numbers.splice(i + 1, 0, secondHalf);
      i++;
      continue;
    }

    numbers[i] *= 2024;
  }
};

export function part1(input: string): number {
  const numbers = parseInput(input);

  // console.log(numbers);
  for (let i = 0; i < 25; i++) {
    blink(numbers);
    // console.log('blinked', i + 1, 'times');
    // console.log(numbers);
  }

  return numbers.length;
}

export function part2(input: string): number {
  const numbers = parseInput(input);

  let totalNumbers = 0;

  const cache: Map<string, number> = new Map();

  const change = (number: number, blinks: number): number => {
    if (blinks === 0) return 1;

    const cacheKey = `${number}=${blinks}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    if (number === 0) {
      const res = change(1, blinks - 1);
      cache.set(cacheKey, res);
      return res;
    }

    const sNum = number.toString();
    if (sNum.length % 2 === 0) {
      const firstHalf = Number(sNum.substring(0, sNum.length / 2));
      const secondHalf = Number(sNum.substring(sNum.length / 2));

      const res =
        change(firstHalf, blinks - 1) + change(secondHalf, blinks - 1);
      cache.set(cacheKey, res);
      return res;
    }

    const res = change(number * 2024, blinks - 1);
    cache.set(cacheKey, res);
    return res;
  };

  numbers.forEach((num) => {
    totalNumbers += change(num, 75);
  });

  return totalNumbers;
}
