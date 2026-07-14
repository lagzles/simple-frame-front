<template>
  <label class="checkbox">
    <input type="checkbox" :checked="modelValue" :disabled="disabled" @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)" />
    <span>{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; disabled?: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
