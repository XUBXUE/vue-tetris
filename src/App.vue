<script setup lang="ts">
import { ref } from "vue";
import Block from './components/block.vue';

const width = 10;

const height = 20

const board = ref<number[]>(
  Array.from({ length: height }, () => 0),
);

// const currentShape = ref();

const convertToBinary = (num: number, length: number) => {
  let binary = num.toString(2);

  if (binary.length > length) return binary;

  return binary.padStart(length, binary);
};

// const generateShape = () => {
//   const square = [];
// };
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
