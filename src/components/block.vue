<script setup lang="ts">
defineProps<{ placeholder: string }>();
</script>

<template>
  <div :class="{'border-gray-500/50': placeholder === '1'}" class="flex h-5 w-5 p-0.5 cursor-pointer items-center justify-center border-2 border-gray-500/20">
    <div :class="{'bg-gray-500/50': placeholder === '1'}" class="w-full h-full bg-gray-500/20"></div>
  </div>
</template>
