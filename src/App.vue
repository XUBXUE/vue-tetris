<script setup lang="ts">
import { ref } from "vue";
import Block from './components/block.vue';
import { ElMessage } from 'element-plus';
import { cloneDeep } from "lodash-es";
import { useKeyboard } from './composables';

enum EState {
  play = 'play',
  pause = 'pause',
}

interface IShape {
  block: number[];
  positionY: number;
}

let timer: number | null;

let currentBlock: IShape | null;

const WIDTH = 10;

const HEIGHT = 20;

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

const board = ref<number[]>(cloneDeep(BOARD));

const state = ref<EState>(EState.pause);

const generateShape = (block: number[]): IShape  => {
  return {
    block,
    positionY: 0,
  };
};

const convertToBinary = (num: number, length: number = WIDTH) => {
  let binary = num.toString(2);

  if (binary.length > length) return binary;

  return binary.padStart(length, '0');
};

const next = () => {
  if (board.value[0] > 0) {
    ElMessage({
      message: 'GAME OVER!!!',
      type: 'error',
      plain: true,
    })
    return;
  }

  if (!currentBlock) {
    currentBlock = generateShape(blocks[Math.floor(Math.random() * blocks.length)]);
    const { block } = currentBlock; 
    board.value[0] = block[block.length - 1];
  }

  timer = setInterval(down, DURATION);
}

// 清除之前的行
const clearPreRow = (block: IShape['block'], positionY: IShape['positionY'], blockHeight: number) => {
  // 把当前块所占位置清除掉
  for (let i = blockHeight - 1, y = positionY; i >= 0; i--) {
    // y小于0时证明所有块所占行都已清除，或部分块未展示，所以跳出循环
    if (y < 0) break;

    // 先用当前格子行取反，再与方块行取或，再取反，得到方块去除后的格子
    const currentClearRow = ~board.value[y];
    board.value[y--] = ~(currentClearRow | block[i]);
  }
}

const moveToNextRow = (block: IShape['block'], positionY: IShape['positionY'], blockHeight: number) => {
  // 向下移动
  for (let i = blockHeight - 1, y = positionY, nextBoardRow = board.value[positionY]; i >= 0; i--) {
    // 更新格子行
    board.value[y] = nextBoardRow | block[blockHeight - 1];

    // 如果最底下位置没有方块高度大，就不渲染多余的，跳出循环
    if (y < blockHeight - 1) break;

    nextBoardRow = board.value[--y];
  }
}

const down = () => {
  console.log('down');

  if (state.value === EState.pause) return;
  
  if (!currentBlock) return;

  // 当前方块信息
  const { positionY, block } = currentBlock!;
  // 方块的高度
  const blockHeight = block.length;
  // 将要下降的纵向坐标索引
  const nextPositionY = positionY + 1;

  // 如果当前形状位置下方有其他方块或下降到最底下时停止下降
  // board.value[nextPositionY + 1] 为下降后的下一行的信息
  if ((block[blockHeight - 1] & board.value[nextPositionY]) > 0 || nextPositionY >= HEIGHT) {
    // 清空所有
    timer && clearInterval(timer);
    timer = null;
    currentBlock = null;
    // 重新开始
    next();
    return;
  };
  
  // 清除之前的行
  clearPreRow(block, positionY, blockHeight);

  // 向下移动
  moveToNextRow(block, nextPositionY, blockHeight);

  // 更新坐标索引
  currentBlock!.positionY = nextPositionY;
};

const left = () => {
  console.log('left');
  if (state.value === EState.pause) return;
  
  if (!currentBlock) return;

  const { block, positionY } = currentBlock;

  // 当前行去除当前方块所占空间
  const fillingRowWithOutBlock = board.value
    .slice(positionY - block.length + 1, positionY + 1)
    .map((i, index) => {
      // 在有当前方块占着的行中清除掉当前方块占着的位置
      return ~(~i | block[index]);
    });

  /**
   * 是否不可移动逻辑是
   * 1.如果块向左移动后与当前行做与运算大于0，表示有块重叠，这表示左侧有方块不能移动
   * 2.如果当前块和最左边有方块的数据做与运算大于0，说明到最左边了不能移动
   */
  const cannotMoveToLeft = fillingRowWithOutBlock.some((row, index) => {
    return (row & (block[index] << 1)) > 0 || (block[index] & (1 << (WIDTH - 1))) > 0;
  });

  if (cannotMoveToLeft) return;

  // 向左移动
  for (let i = 0, y = positionY; i < block.length; i++) {
    board.value[y--] = (block[i] = block[i] << 1);
  }
}

const right = () => {
  console.log('right');
};

const rotate = () => {
  console.log('rotate');
};

// 瞬间掉落
const drop = () => {
  console.log('drop');
  if (state.value === EState.pause) return;
  
  if (!currentBlock) return;

  const { block, positionY } = currentBlock;

  const blockHeight = block.length;
  // 当前块最底部的行
  const blockBottom = block[blockHeight - 1];
  // 第一个非空行的索引
  const firstNonEmptyBoardIndex = board.value.slice(positionY + 1).findIndex(board => (board & blockBottom) > 0);
  // 存在该位置就渐落到firstNonEmptyBoardIndex上一个索引的位置，不存在该位置，表示可以直接降落到底部
  const finalPositionY = ~firstNonEmptyBoardIndex ? firstNonEmptyBoardIndex + positionY : HEIGHT - 1;
  
  // 清除之前的行
  clearPreRow(block, positionY, blockHeight);

  // 向下移动
  moveToNextRow(block, finalPositionY, blockHeight);

  timer && clearInterval(timer);
  timer = null;
  currentBlock = null;
  // 重新开始
  next();
};

const start = () => {
  next();
};

const reset = () => {
  board.value = cloneDeep(BOARD);
  timer && clearInterval(timer);
  timer = null;
  currentBlock = null;
  state.value = EState.pause;
}

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

useKeyboard('ArrowLeft', left);
useKeyboard('ArrowRight', right);
useKeyboard('ArrowUp', rotate);
useKeyboard('ArrowDown', down);
useKeyboard(' ', drop, { once: true });
</script>

<template>
  <div class="flex flex-col gap-px items-center justify-center mt-40">
    <div
      class="flex items-center justify-center gap-px"
      v-for="(row, y) in board"
      :key="y"
    >
      <Block
        v-for="(placeholder, x) in convertToBinary(row)"
        :key="x"
        :placeholder="placeholder"
      />
    </div>
  </div>
  <div class="flex justify-center mt-2">
    <button class="border p-1 border-gray-500/50 rounded text-sm text-gray-500" @click="toggleState">{{ state === EState.play ? '暂停' : '开始' }}</button>
    <button class="border p-1 border-gray-500/50 rounded text-sm text-gray-500 ml-2" @click="reset">重开</button>
  </div>
</template>
