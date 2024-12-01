import { readInput } from '../../utils/input';

const isTwoStringArray = (input: unknown): input is [string, string] => {
  if (!Array.isArray(input)) return false;
  if (input.length !== 2) return false;
  if (typeof input[0] !== 'string') return false;
  if (typeof input[1] !== 'string') return false;
  return true;
};

export function part1(input: string): number {
  const lines = input.split('\r\n');

  const list1: number[] = [];
  const list2: number[] = [];

  for (const line of lines) {
    const locIds = line.split('   ');

    if (!isTwoStringArray(locIds)) {
      throw new Error('Invalid input');
    }

    const loc1 = Number(locIds[0]);
    const loc2 = Number(locIds[1]);

    if (!list1.length || list1[list1.length - 1] <= loc1) {
      list1.push(loc1);
    } else {
      for (let i = 0; i < list1.length; i++) {
        if (loc1 < list1[i]) {
          list1.splice(i, 0, loc1);
          break;
        }
      }
    }

    if (!list2.length || list2[list2.length - 1] <= loc2) {
      list2.push(loc2);
    } else {
      for (let i = 0; i < list2.length; i++) {
        if (loc2 < list2[i]) {
          list2.splice(i, 0, loc2);
          break;
        }
      }
    }
  }

  let totalDistance: number = 0;

  for (let i = 0; i < list1.length; i++) {
    totalDistance += Math.abs(list1[i] - list2[i]);
  }

  return totalDistance;
}

part1(readInput('day1', '2024', 'example.txt'));

export function part2(input: string) {
  const lines = input.split('\n');

  return 0;
}
