import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function readInput(
  day: number,
  year = 2024,
  filename = 'input.txt'
): string {
  const path = join(__dirname, '..', year.toString(), `day${day}`, filename);
  return readFileSync(path, 'utf8').trim();
}
