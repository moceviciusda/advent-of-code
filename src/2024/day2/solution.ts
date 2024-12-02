const isTwoStringArray = (input: unknown): input is [string, string] => {
  if (!Array.isArray(input)) return false;
  if (input.length !== 2) return false;
  if (typeof input[0] !== 'string') return false;
  if (typeof input[1] !== 'string') return false;
  return true;
};

const parseInput = (input: string): number[][] => {
  const lines = input.split('\r\n');
  const parsedLines: number[][] = [];

  for (const line of lines) {
    parsedLines.push(line.split(' ').map(Number));
  }

  return parsedLines;
};

export function part1(input: string): number {
  const reports = parseInput(input);

  let safeReportCount: number = 0;

  for (const report of reports) {
    let decreasing: boolean;

    if (report[0] === report[1]) {
      continue;
    }
    if (report[0] > report[1]) {
      decreasing = true;
    } else {
      decreasing = false;
    }

    let safe = true;
    for (let i = 1; i < report.length; i++) {
      const curr = report[i];
      const prev = report[i - 1];
      if (curr === prev) {
        safe = false;
        break;
      }

      if (decreasing) {
        if (prev < curr || prev > curr + 3) {
          safe = false;
          break;
        }
      }

      if (!decreasing) {
        if (prev > curr || prev + 3 < curr) {
          safe = false;
          break;
        }
      }
    }

    console.log(report, safe);

    if (safe) safeReportCount++;
  }

  return safeReportCount;
}

export function part2(input: string): number {
  const [list1, list2] = parseInput(input);

  let similarityScore: number = 0;

  let list2Idx: number = 0;
  let lastScore: number = 0;

  for (let i = 0; i < list1.length; i++) {
    const id = list1[i];

    if (id === list1[i - 1]) {
      similarityScore += lastScore;
      continue;
    }

    lastScore = 0;
    for (; list2Idx < list2.length; list2Idx++) {
      if (list2[list2Idx] < id) continue;
      if (list2[list2Idx] > id) break;

      lastScore += id;
    }

    similarityScore += lastScore;
  }

  return similarityScore;
}
