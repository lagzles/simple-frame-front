<template>
  <button class="btn" :class="`btn-${variant}`" :type="type" :disabled="disabled || loading">
    <span v-if="loading" class="spinner tiny" />
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button' },
)
</script>
