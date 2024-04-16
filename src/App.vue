<script setup lang="ts">
import { ref } from "vue";
import Block from './components/block.vue';
import { cloneDeep } from "lodash-es";

enum EState {
  play = 'play',
  pause = 'pause',
}

interface IShape {
  block: number[];
  positionY: number;
}

let timer: number | null;

const WIDTH = 10;

const HEIGHT = 5;

const DURATION = 1000;

const BOARD = Array.from({ length: HEIGHT }, () => 0);

/**
 * 0000110000
 * 0000110000
 */
const SQUARE = [48, 48];

/** 0001111000 */
const LINE = [120];

const blocks = [SQUARE, LINE];

// 当前方块
let currentBlock: IShape | null;

const board = ref<number[]>(cloneDeep(BOARD));

const state = ref<EState>(EState.pause);

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

const reset = () => {
  board.value = cloneDeep(BOARD);
  timer && clearInterval(timer);
  timer = null;
  currentBlock = null;
  state.value = EState.pause;
}

const next = () => {
  if (board.value[0] > 0) {
    setTimeout(() => {
      alert('GAME OVER!!!');
      reset();
    }, 100);
    return;
  }

  if (!currentBlock) {
    currentBlock = generateShape(blocks[Math.floor(Math.random() * blocks.length)]);
  }

  timer = setInterval(down, DURATION);
}

const down = () => {
  console.log('debug')
  // 当前方块信息
  const { positionY, block } = currentBlock!;
  // 方块的高度
  const blockHeight = block.length;
  // 将要下降的纵向坐标索引
  const nextPositionY = positionY + 1;

  // 把当前块所占位置清除掉
  for (let i = blockHeight - 1, y = positionY; i >= 0; i--) {
    // y小于0时证明所有块所占行都已清除，或部分块未展示，所以跳出循环
    if (y < 0) break;

    // 先用当前格子行取反，再与方块行取或，再取反，得到方块去除后的格子
    let currentClearRow = ~board.value[y];
    board.value[y--] = ~(currentClearRow | block[i]);
  }

  // 向下移动
  for (let i = blockHeight - 1, y = nextPositionY, nextBoardRow = board.value[nextPositionY]; i >= 0; i--) {
    // 更新格子行
    board.value[y] = nextBoardRow | block[blockHeight - 1];

    // 如果最底下位置没有方块高度大，就不渲染多余的，跳出循环
    if (y < blockHeight - 1) break;

    nextBoardRow = board.value[--y];
  }

  // 更新坐标索引
  currentBlock!.positionY = nextPositionY;

  // 如果当前形状位置下方有其他方块或下降到最底下时停止下降
  // board.value[nextPositionY + 1] 为下降后的下一行的信息
  if ((block[blockHeight - 1] & board.value[nextPositionY + 1]) > 0 || nextPositionY >= HEIGHT - 1) {
    // 清空所有
    timer && clearInterval(timer);
    timer = null;
    currentBlock = null;
    // 重新开始
    next();
    return;
  };
};

const start = () => {
  next();
};

const pause = () => {
  timer && clearInterval(timer);
  timer = null;
}

const toggleState = () => {
  state.value = state.value === EState.play ? EState.pause : EState.play;

  if (state.value === EState.play) {
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
        v-for="(placeholder, x) in convertToBinary(row, WIDTH)"
        :key="x"
        :placeholder="placeholder"
      />
    </div>
  </div>
  <div class="flex justify-center mt-2">
    <button class="border p-1 border-gray-500/50 rounded text-sm" @click="toggleState">{{ state === EState.play ? '暂停' : '开始' }}</button>
    <button class="border p-1 border-gray-500/50 rounded text-sm ml-2" @click="reset">重开</button>
  </div>
</template>
