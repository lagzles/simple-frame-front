<template>
  <form class="form-grid" @submit.prevent="submit">
    <AppFormField label="Nome do portico" required>
      <AppInput v-model="form.name" />
    </AppFormField>
    <AppFormField label="Vaos" unit="m" hint="Separe por virgula. Ex: 12, 12" required>
      <AppInput v-model="spansText" />
    </AppFormField>
    <AppFormField label="Altura livre" unit="m" required>
      <AppNumberInput v-model="form.freeHeight" :min="0.01" />
    </AppFormField>
    <AppFormField label="Cobertura" required>
      <AppSelect v-model="form.roofType" :options="roofOptions" />
    </AppFormField>
    <AppFormField v-if="form.roofType === 'double_slope'" label="Cumeeira" unit="m">
      <AppNumberInput v-model="form.ridgeX" :min="0" />
    </AppFormField>
    <AppFormField label="Inclinacao" unit="%" required>
      <AppNumberInput v-model="form.roofSlopePercent" :min="0" :max="100" />
    </AppFormField>
    <AppFormField label="Largura de influencia" unit="m" required>
      <AppNumberInput v-model="form.influenceWidth" :min="0.01" />
    </AppFormField>
    <AppFormField label="Altura minima de alma" unit="mm">
      <AppNumberInput v-model="form.minimumWebHeight" :min="1" />
    </AppFormField>
    <AppCheckbox v-model="form.hasSteelColumns" label="Modelar pilares metalicos ate a base" />
    <AppAlert v-if="error" variant="danger" :message="error" />
    <div class="form-actions">
      <AppButton type="submit" :loading="loading">Gerar portico</AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { RoofType } from '../../types'
import AppAlert from '../ui/AppAlert.vue'
import AppButton from '../ui/AppButton.vue'
import AppCheckbox from '../ui/AppCheckbox.vue'
import AppFormField from '../ui/AppFormField.vue'
import AppInput from '../ui/AppInput.vue'
import AppNumberInput from '../ui/AppNumberInput.vue'
import AppSelect from '../ui/AppSelect.vue'

const props = defineProps<{ modulationId: string; roofSlopePercent: number; frameSpacing: number; loading?: boolean }>()
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

const roofOptions = [
  { label: 'Duas aguas', value: 'double_slope' },
  { label: 'Uma agua', value: 'single_slope' },
]
const spansText = ref('12, 12')
const error = ref('')
const form = reactive({
  name: 'Portico tipo A',
  freeHeight: 7,
  ridgeX: 12,
  roofSlopePercent: props.roofSlopePercent,
  influenceWidth: props.frameSpacing,
  minimumWebHeight: 400,
  hasSteelColumns: true,
  roofType: 'double_slope' as RoofType,
})

function submit() {
  error.value = ''
  const spanList = spansText.value
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0)

  if (!spanList.length) {
    error.value = 'Informe pelo menos um vao valido.'
    return
  }

  emit('submit', {
    modulationId: props.modulationId,
    name: form.name,
    spanList,
    freeHeight: form.freeHeight,
    ridgeX: form.roofType === 'double_slope' ? form.ridgeX : undefined,
    roofSlopePercent: form.roofSlopePercent,
    influenceWidth: form.influenceWidth,
    minimumWebHeight: form.minimumWebHeight,
    hasSteelColumns: form.hasSteelColumns,
    roofType: form.roofType,
  })
}
</script>
