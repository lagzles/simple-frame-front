<template>
  <form class="form-grid" @submit.prevent="submit">
    <AppFormField label="Carga permanente" unit="kgf/m²">
      <AppNumberInput v-model="form.cp" />
    </AppFormField>
    <AppFormField label="Sobrecarga norma" unit="kgf/m²">
      <AppNumberInput v-model="form.sc" />
    </AppFormField>
    <AppFormField label="Sobrecarga utilidade" unit="kgf/m²">
      <AppNumberInput v-model="form.su" />
    </AppFormField>
    <AppFormField label="Vento" unit="kgf/m²">
      <AppNumberInput v-model="form.cv" />
    </AppFormField>
    <div class="form-actions">
      <AppButton type="submit">Salvar cargas</AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AppButton from '../ui/AppButton.vue'
import AppFormField from '../ui/AppFormField.vue'
import AppNumberInput from '../ui/AppNumberInput.vue'

const emit = defineEmits<{ submit: [value: { cp: number; sc: number; su: number; cv: number }] }>()
const form = reactive({ cp: 25, sc: 15, su: 10, cv: 40 })

function submit() {
  emit('submit', { ...form })
}
</script>
