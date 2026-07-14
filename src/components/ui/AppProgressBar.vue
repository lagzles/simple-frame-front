<template>
  <div class="progress-wrap">
    <div class="progress-label">
      <span>{{ label }}</span>
      <strong>{{ value }}%</strong>
    </div>
    <div class="progress"><div :style="{ width: `${value}%` }" /></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ value: number; label: string }>()
</script>
