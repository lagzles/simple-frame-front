<template>
  <select class="input" :value="modelValue" :disabled="disabled" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
    <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  options: { label: string; value: string }[]
  disabled?: boolean
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
