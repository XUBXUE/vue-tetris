<script setup lang="ts">
import { ref } from "vue";
import Block from './components/block.vue';

interface IShape {
  block: number[];
  positionY: number;
}

let timer: number;

const width = 10;

const height = 10;

const board = ref<number[]>(
  Array.from({ length: height }, () => 0),
);

/**
 * 0000110000
 * 0000110000
 */
const square = [48, 48];

/** 0001111000 */
const line = [120];

const blocks = [square, line];

let currentShape: IShape;

const generateShape = (block: number[]): IShape  => {
  return {
    block,
    positionY: -1,
  };
};

const convertToBinary = (num: number, length: number) => {
  let binary = num.toString(2);

  if (binary.length > length) return binary;

  return binary.padStart(length, '0');
};

const down = () => {
  const { positionY, block } = currentShape;
  const blockHeight = block.length;
  let nextPositionY = positionY + 1;
  let nextBoardRow = board.value[nextPositionY];
  currentShape.positionY = nextPositionY;

  // 如果当前形状位置下方有其他方块时，停止下降
  if ((block[blockHeight - 1] & nextBoardRow) > 0) {
    clearInterval(timer);
    return;
  };

  for (let i = blockHeight - 1; i >= 0; i--) {
    board.value[nextPositionY] = nextBoardRow | block[blockHeight - 1];

    if (nextPositionY < blockHeight - 1) break;
    nextBoardRow = board.value[--nextPositionY];
  }
};

const start = () => {
  currentShape = generateShape(blocks[Math.floor(Math.random() * blocks.length)]);
  console.log(currentShape);
  timer = setInterval(down, 1000);
};

start();

// 1 0   0 0   0 2   0 0
// 0 0   0 1   1 2   1 0
// 0 1   1 1   1 1   2 0
// 0 2   2 1   1 0   2 1
</script>

<template>
  <div class="flex flex-col gap-px items-center justify-center pt-10">
    <div
      class="flex items-center justify-center gap-px"
      v-for="(row, y) in board"
      :key="y"
    >
      <Block
        v-for="(placeholder, x) in convertToBinary(row, width)"
        :key="x"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>
