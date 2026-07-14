<template>
  <form class="form-grid" @submit.prevent="submit">
    <AppFormField label="Vãos" unit="m" hint="Separe por vírgula. Ex: 12, 12">
      <AppInput v-model="spansText" />
    </AppFormField>
    <AppFormField label="Cumeeira" unit="m">
      <AppNumberInput v-model="form.ridgeX" :min="0" />
    </AppFormField>
    <AppFormField label="Largura de influência" unit="m">
      <AppNumberInput v-model="form.influenceWidth" :min="0.01" />
    </AppFormField>
    <AppFormField label="Altura mínima de alma" unit="mm">
      <AppNumberInput v-model="form.minimumWebHeight" :min="1" />
    </AppFormField>
    <AppCheckbox v-model="form.hasSteelColumns" label="Modelar pilares metálicos até a base" />
    <div class="form-actions">
      <AppButton type="submit" :loading="loading">Gerar pórtico</AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Building, RoofType } from '../../types'
import AppButton from '../ui/AppButton.vue'
import AppCheckbox from '../ui/AppCheckbox.vue'
import AppFormField from '../ui/AppFormField.vue'
import AppInput from '../ui/AppInput.vue'
import AppNumberInput from '../ui/AppNumberInput.vue'

const props = defineProps<{ building: Building; modulationId: string; loading?: boolean }>()
const emit = defineEmits<{
  submit: [value: {
    modulationId: string
    name: string
    spanList: number[]
    freeHeight: number
    ridgeX?: number
    roofSlopePercent: number
    influenceWidth: number
    minimumWebHeight?: number
    hasSteelColumns: boolean
    roofType: RoofType
  }]
}>()

const spansText = ref('12, 12')
const form = reactive({
  ridgeX: 12,
  influenceWidth: props.building.frameSpacing,
  minimumWebHeight: 400,
  hasSteelColumns: true,
})

function submit() {
  const spanList = spansText.value.split(',').map((value) => Number(value.trim())).filter((value) => value > 0)
  emit('submit', {
    modulationId: props.modulationId,
    name: 'Pórtico tipo A',
    spanList,
    freeHeight: props.building.freeHeight,
    ridgeX: form.ridgeX,
    roofSlopePercent: props.building.roofSlopePercent,
    influenceWidth: form.influenceWidth,
    minimumWebHeight: form.minimumWebHeight,
    hasSteelColumns: form.hasSteelColumns,
    roofType: props.building.roofType,
  })
}
</script>
