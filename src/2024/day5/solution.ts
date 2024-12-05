type OrderingRules = Map<string, { before: string[]; after: string[] }>;

type Update = string[];

const parseInput = (input: string): [OrderingRules, Update[]] => {
  const sections = input.split('\r\n\r\n');
  if (sections.length !== 2) throw new Error('corrupted input');

  const rules: OrderingRules = new Map();

  sections[0].split('\r\n').forEach((strRule) => {
    const rule = strRule.split('|');
    if (rule.length !== 2) throw new Error('corrupted rules');

    const [before, after] = rule;

    const beforeRule = rules.get(before);
    if (beforeRule) {
      beforeRule.after.push(after);
    } else {
      rules.set(before, { before: [], after: [after] });
    }

    const afterRule = rules.get(after);
    if (afterRule) {
      afterRule.before.push(before);
    } else {
      rules.set(after, { before: [before], after: [] });
    }
  });

  const updates: Update[] = sections[1]
    .split('\r\n')
    .map((strUpdate) => strUpdate.split(','));

  return [rules, updates];
};

const validateUpdate = (update: Update, rules: OrderingRules): boolean => {
  for (let i = 0; i < update.length; i++) {
    const page = update[i];
    const pageRules = rules.get(page);

    for (let j = i + 1; j < update.length; j++) {
      const pageAfter = update[j];

      if (pageRules?.before.includes(pageAfter)) return false;
    }
  }

  return true;
};

const getMiddlePage = (update: Update): number => {
  if (update.length % 2 === 0) throw new Error('update without middle');

  return Number(update[Math.floor(update.length / 2)]);
};

const fixOrder = (update: Update, rules: OrderingRules): Update => {
  const ordered: Update = [];

  for (let i = 0; i < update.length; i++) {
    const page = update[i];
    const pageRules = rules.get(page);

    let insertAt = 0;

    for (; insertAt < ordered.length; insertAt++) {
      const orderedPage = ordered[insertAt];

      if (pageRules?.after.includes(orderedPage)) break;
    }

    ordered.splice(insertAt, 0, page);
  }

  return ordered;
};

export function part1(input: string): number {
  const [rules, updates] = parseInput(input);

  let middleSum: number = 0;

  updates.forEach((update) => {
    if (validateUpdate(update, rules)) middleSum += getMiddlePage(update);
  });

  return middleSum;
}

export function part2(input: string): number {
  const [rules, updates] = parseInput(input);

  let middleSum: number = 0;

  updates.forEach((update) => {
    if (validateUpdate(update, rules)) return;

    const ordered = fixOrder(update, rules);
    middleSum += getMiddlePage(ordered);
  });

  return middleSum;
}
