<template>
  <div class="empty">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; message: string }>()
</script>
