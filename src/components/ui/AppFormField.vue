<template>
  <label class="field">
    <span class="field-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
      <small v-if="unit">{{ unit }}</small>
    </span>
    <slot />
    <span v-if="hint" class="field-hint">{{ hint }}</span>
    <span v-if="error" class="field-error">{{ error }}</span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
  unit?: string
  hint?: string
  error?: string
}>()
</script>
