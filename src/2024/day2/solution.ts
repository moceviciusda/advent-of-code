const parseInput = (input: string): number[][] => {
  const lines = input.split('\r\n');
  const parsedLines: number[][] = [];

  for (const line of lines) {
    parsedLines.push(line.split(' ').map(Number));
  }

  return parsedLines;
};

const validateReport = (report: number[]): boolean => {
  if (report[0] === report[1]) {
    return false;
  }

  let decreasing: boolean;
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

  return safe;
};

const problemDampener = (report: number[]): boolean => {
  for (let i = 0; i < report.length; i++) {
    const modifiedReport = [...report];
    modifiedReport.splice(i, 1);
    if (validateReport(modifiedReport)) return true;
  }

  return false;
};

export function part1(input: string): number {
  const reports = parseInput(input);

  let safeReportCount: number = 0;
  for (const report of reports) {
    if (validateReport(report)) safeReportCount++;
  }

  return safeReportCount;
}

export function part2(input: string): number {
  const reports = parseInput(input);

  let safeReportCount: number = 0;
  for (const report of reports) {
    if (validateReport(report)) {
      safeReportCount++;
      continue;
    }

    if (problemDampener(report)) safeReportCount++;
  }

  return safeReportCount;
}
