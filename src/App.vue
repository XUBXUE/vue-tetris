<script setup lang="ts">
import { ref } from "vue";
import Block from './components/block.vue';

interface IShape {
  block: number[];
  positionY: number;
}

let timer: number | null;

const width = 10;

const height = 10;

/**
 * 0000110000
 * 0000110000
 */
const square = [48, 48];

/** 0001111000 */
const line = [120];

const blocks = [square, line];

// 当前方块
let currentBlock: IShape | null;

const board = ref<number[]>(
  Array.from({ length: height }, () => 0),
);

const state = ref<'play' | 'pause'>('pause');

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
  console.log('debug')
  // 当前方块信息
  const { positionY, block } = currentBlock!;
  // 方块的高度
  const blockHeight = block.length;
  // 将要下降的纵向坐标索引
  let nextPositionY = positionY + 1;
  // 将要下降的行的信息
  let nextBoardRow = board.value[nextPositionY];

  // 如果当前形状位置下方有其他方块或下降到最底下时停止下降
  if ((block[blockHeight - 1] & nextBoardRow) > 0 || nextPositionY >= height) {
    // 清空所有
    timer && clearInterval(timer);
    timer = null;
    currentBlock = null;
    // 重新开始
    start();
    return;
  };

  // 把当前块所占位置清除掉
  for (let i = blockHeight - 1, y = positionY; i >= 0; i--) {
    // 如果索引小于零证明到头了，就不用继续清了
    if (y < 0) break;

    // 先用当前格子行取反，再与方块行取或，再取反，得到方块去除后的格子
    let currentClearRow = ~board.value[y];
    board.value[y--] = ~(currentClearRow | block[i]);
  }

  // 更新坐标索引
  currentBlock!.positionY = nextPositionY;

  for (let i = blockHeight - 1, y = nextPositionY; i >= 0; i--) {
    // 更新格子行
    board.value[y] = nextBoardRow | block[blockHeight - 1];

    // 如果最底下位置没有方块高度大，就不渲染多余的，跳出循环
    if (y < blockHeight - 1) break;
    nextBoardRow = board.value[--y];
  }
};

const start = () => {
  if (!currentBlock) {
    currentBlock = generateShape(blocks[Math.floor(Math.random() * blocks.length)]);
  }

  timer = setInterval(down, 500);
};

const pause = () => {
  timer && clearInterval(timer);
  timer = null;
}

const toggleState = () => {
  state.value = state.value === 'play' ? 'pause' : 'play';

  if (state.value === 'play') {
    start();
  } else {
    pause();
  }
}
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
  <div class="flex justify-center mt-2">
    <button class="border p-1 border-gray-500/50 rounded text-sm" @click="toggleState">{{ state === 'play' ? '暂停' : '开始' }}</button>
  </div>
</template>
