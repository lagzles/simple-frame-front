<template>
  <span class="badge" :class="`badge-${variant}`">{{ label }}</span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label: string; variant?: 'neutral' | 'success' | 'warning' | 'danger' }>(), { variant: 'neutral' })
</script>
