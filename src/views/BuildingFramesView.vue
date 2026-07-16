<template>
  <AppLayout>
    <AppPageHeader title="Modulacoes" :subtitle="building ? `Galpao ${building.name}` : 'Modulacoes vinculadas ao galpao selecionado.'">
      <template #actions>
        <AppButton @click="showForm = !showForm">{{ showForm ? 'Fechar' : 'Nova modulacao' }}</AppButton>
      </template>
    </AppPageHeader>

    <AppAlert v-if="buildings.error || model.error" variant="danger" :message="buildings.error || model.error" />
    <AppAlert v-if="!building && !buildings.loading" variant="warning" message="Galpao nao carregado. Volte para a lista e abra um galpao." />

    <AppCard v-if="building && showForm" class="section">
      <form class="form-grid" @submit.prevent="createModulation">
        <AppFormField label="Nome" required>
          <AppInput v-model="form.name" />
        </AppFormField>
        <AppFormField label="Quantidade de porticos" required>
          <AppNumberInput v-model="form.repeatCount" :min="1" :step="1" />
        </AppFormField>
        <AppFormField label="Distancia entre porticos" unit="m" required>
          <AppNumberInput v-model="form.frameSpacing" :min="0.01" />
        </AppFormField>
        <AppFormField label="Ordem" required>
          <AppNumberInput v-model="form.orderIndex" :min="0" :step="1" />
        </AppFormField>
        <div class="form-actions">
          <AppButton type="submit" :loading="model.loading">Salvar modulacao</AppButton>
        </div>
      </form>
    </AppCard>

    <AppEmptyState v-if="!model.loading && !model.modulations.length" title="Nenhuma modulacao criada" message="Crie uma modulacao para definir quantidade e distancia entre porticos." />

    <div class="grid-list">
      <FrameCard v-for="modulation in model.modulations" :key="modulation.id" :modulation="modulation" @open="open" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import FrameCard from '../components/domain/FrameCard.vue'
import AppAlert from '../components/ui/AppAlert.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppEmptyState from '../components/ui/AppEmptyState.vue'
import AppFormField from '../components/ui/AppFormField.vue'
import AppInput from '../components/ui/AppInput.vue'
import AppNumberInput from '../components/ui/AppNumberInput.vue'
import AppPageHeader from '../components/ui/AppPageHeader.vue'
import { useBuildingStore } from '../stores/buildings'
import { useModelStore, type ModulationInput } from '../stores/model'
import type { Modulation } from '../types'

const route = useRoute()
const router = useRouter()
const buildings = useBuildingStore()
const model = useModelStore()
const showForm = ref(false)
const buildingId = computed(() => String(route.params.buildingId))
const building = computed(() => buildings.current ?? buildings.buildings.find((item) => item.id === buildingId.value) ?? null)
const form = reactive<ModulationInput>({
  name: 'Modulacao A',
  orderIndex: 0,
  repeatCount: 6,
  frameSpacing: 6,
})

onMounted(async () => {
  if (!buildings.buildings.length) await buildings.loadBuildings()
  buildings.setCurrent(buildingId.value)
  await model.loadModulations(buildingId.value)
  form.orderIndex = model.modulations.length
})

async function createModulation() {
  if (!building.value) return
  const modulation = await model.createModulation(building.value.id, { ...form })
  showForm.value = false
  form.name = `Modulacao ${model.modulations.length + 1}`
  form.orderIndex = model.modulations.length
  await router.push(`/buildings/${buildingId.value}/modulations/${modulation.id}`)
}

async function open(modulation: Modulation) {
  await router.push(`/buildings/${buildingId.value}/modulations/${modulation.id}`)
}
</script>
