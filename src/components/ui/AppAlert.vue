<template>
  <div class="alert" :class="`alert-${variant}`">
    <strong v-if="title">{{ title }}</strong>
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'info' | 'success' | 'warning' | 'danger'; title?: string; message: string }>(), { variant: 'info' })
</script>
