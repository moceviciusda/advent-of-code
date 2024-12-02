import { expect, describe, it } from 'vitest';
import { part1, part2 } from './solution';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readInput } from '../../utils/input';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = __dirname.split('\\');
const day = path.pop() ?? 'sum wrong';
const year = path.pop() ?? 'sum wrong';

describe(day, () => {
  const input = readInput(day, year, 'example.txt');
  describe('Part 1', () => {
    it('should solve example input', () => {
      expect(part1(input)).toBe(2);
    });
  });

  describe('Part 2', () => {
    it('should solve example input', () => {
      expect(part2(input)).toBe(31);
    });
  });

  console.table({
    'Part 1': { [day]: part1(readInput(day, year)) },
    'Part 2': { [day]: part2(readInput(day, year)) },
  });
});
