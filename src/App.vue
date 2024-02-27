<script setup lang="ts">
import { ref } from "vue";
import Block from './components/block.vue';
import type { BlockState } from "./type";

const width = 10;

const height = 20;

const board = ref<BlockState[][]>(
  Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      full: false,
    })),
  ),
);

console.log(board.value);
</script>

<template>
  <div class="flex flex-col gap-px items-center justify-center pt-10">
    <div
      class="flex items-center justify-center gap-px"
      v-for="(row, y) in board"
      :key="y"
    >
      <Block
        class="flex h-5 w-5 p-0.5 cursor-pointer items-center justify-center border-2 border-gray-500/20"
        v-for="(block, x) in row"
        :key="x"
        :block="block"
      />
    </div>
    <!-- <div class="m-2 flex items-center justify-between">
        <button
          class="rounded bg-gray-500/20 p-2 text-white hover:bg-gray-500/50"
          @click="simple"
        >
          Simple
        </button>
        <button
          class="rounded bg-gray-500/20 p-2 text-white hover:bg-gray-500/50"
          @click="normal"
        >
          Normal
        </button>
        <button
          class="rounded bg-gray-500/20 p-2 text-white hover:bg-gray-500/50"
          @click="difficult"
        >
          Difficult
        </button>
      </div> -->
  </div>
</template>
