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

const fragmentedCompact = (blocks: Block[]) => {
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

const compact = (blocks: Block[]) => {
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (typeof blocks[i] === 'undefined') continue;

    let fromIdx: number = i;
    while (blocks[fromIdx] === blocks[i]) fromIdx--;
    fromIdx++;

    const blocksToMove = blocks.slice(fromIdx, i + 1);

    for (let j = 0; j + blocksToMove.length <= fromIdx; j++) {
      if (typeof blocks[j] !== 'undefined') continue;

      let emptyLength: number = 1;
      while (typeof blocks[j + emptyLength] === 'undefined') emptyLength++;

      if (emptyLength >= blocksToMove.length) {
        blocks.splice(
          fromIdx,
          blocksToMove.length,
          ...Array(blocksToMove.length)
        );
        blocks.splice(j, blocksToMove.length, ...blocksToMove);

        break;
      }
    }

    i = fromIdx;
  }
};

export function part1(input: string): number {
  const blocks = parseInput(input);
  fragmentedCompact(blocks);

  return calculateChecksum(blocks);
}

export function part2(input: string): number {
  const blocks = parseInput(input);
  compact(blocks);

  return calculateChecksum(blocks);
}
