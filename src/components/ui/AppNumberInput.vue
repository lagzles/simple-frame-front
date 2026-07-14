<template>
  <input
    class="input"
    type="number"
    :value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
  }>(),
  { step: 0.01 },
)
defineEmits<{ 'update:modelValue': [value: number] }>()
</script>
