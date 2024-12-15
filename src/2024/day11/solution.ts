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
  return 0;
}
