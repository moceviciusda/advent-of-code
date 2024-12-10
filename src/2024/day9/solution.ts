type Block = string | undefined;

const parseInput = (input: string): Block[] => {
  const diskMap = input.split('');
  const blocks: Block[] = [];

  for (let i = 0, fileId = 0; i < diskMap.length; i += 2, fileId++) {
    blocks.push(...Array(Number(diskMap[i])).fill(fileId));

    typeof diskMap[i + 1] !== 'undefined' &&
      blocks.push(...Array(Number(diskMap[i + 1])));
  }

  return blocks;
};

const compactFiles = (blocks: Block[]) => {
  for (let i = 0; i < blocks.length; i++) {
    if (typeof blocks[i] !== 'undefined') continue;

    let endBlock: Block;
    while (typeof endBlock === 'undefined' && i < blocks.length) {
      endBlock = blocks.pop();
    }

    blocks.splice(i, 1, endBlock);
  }
};

const calculateChecksum = (blocks: Block[]): number => {
  let checksum = 0;

  blocks.forEach((block, i) => {
    checksum += Number(block ?? 0) * i;
  });

  return checksum;
};

export function part1(input: string): number {
  const blocks = parseInput(input);
  compactFiles(blocks);

  return calculateChecksum(blocks);
}

export function part2(input: string): number {
  const blocks = parseInput(input);

  return 0;
}
