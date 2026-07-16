<template>
  <form class="form-grid" @submit.prevent="submit">
    <AppFormField label="Nome" required>
      <AppInput v-model="form.name" />
    </AppFormField>
    <!-- <AppFormField label="Distância entre pórticos" unit="m" required>
      <AppNumberInput v-model="form.frameSpacing" :min="0.01" />
    </AppFormField>
    <AppFormField label="Quantidade de pórticos" required>
      <AppNumberInput v-model="form.frameCount" :min="1" :step="1" />
    </AppFormField>
    <AppFormField label="Altura livre" unit="m" required>
      <AppNumberInput v-model="form.freeHeight" :min="0.01" />
    </AppFormField>
    <AppFormField label="Cobertura" required>
      <AppSelect v-model="form.roofType" :options="roofOptions" />
    </AppFormField> -->
    <AppFormField label="Inclinação" unit="%" required>
      <AppNumberInput v-model="form.roofSlopePercent" :min="0" />
    </AppFormField>
    <div class="form-actions">
      <AppButton type="submit" :loading="loading">{{ submitLabel }}</AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { BuildingInput } from '../../stores/buildings'
import AppButton from '../ui/AppButton.vue'
import AppFormField from '../ui/AppFormField.vue'
import AppInput from '../ui/AppInput.vue'
import AppNumberInput from '../ui/AppNumberInput.vue'

const props = withDefaults(defineProps<{ loading?: boolean; submitLabel?: string }>(), { submitLabel: 'Salvar prédio' })
const emit = defineEmits<{ submit: [value: BuildingInput] }>()

const form = reactive<BuildingInput>({
  name: 'Galpão 01',
  roofSlopePercent: 5,
})


function submit() {
  emit('submit', { ...form })
}
</script>
