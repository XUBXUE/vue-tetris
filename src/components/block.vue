<script setup lang="ts">
import type { BlockState } from '../type';

defineProps<{ block: BlockState }>();
</script>

<template>
  <div
    class="flex h-5 w-5 p-0.5 cursor-pointer items-center justify-center border-2 border-gray-500/20"
    v-for="(_, x) in block"
    :key="x"
  >
    <div class="w-full h-full bg-gray-500/20"></div>
  </div>
</template>
