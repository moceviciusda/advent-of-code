import { expect, describe, it } from 'vitest';
import { part1, part2 } from './solution';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readInput } from '../../utils/input';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const day = __dirname.split('\\').pop();

describe(day ?? 'sum wrong', () => {
  describe('Part 1', () => {
    it('should solve example input', () => {
      const input = readInput(1, 2024, 'example.txt');
      expect(part1(input)).toBe(0);
    });
  });

  describe('Part 2', () => {
    it('should solve example input', () => {
      const input = readInput(1, 2024, 'example.txt');
      expect(part2(input)).toBe(0);
    });
  });

  console.table({
    day,
    part1: part1(readInput(1, 2024)),
    part2: part2(readInput(1, 2024)),
  });
});
