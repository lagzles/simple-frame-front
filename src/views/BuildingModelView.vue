<template>
  <AppLayout>
    <AppPageHeader :title="model.modulation?.name ?? 'Modulacao'" :subtitle="building ? `Galpao ${building.name}` : 'Detalhe da modulacao e portico tipo.'">
      <template #actions>
        <AppButton variant="secondary" @click="router.push(`/buildings/${buildingId}/modulations`)">Voltar</AppButton>
      </template>
    </AppPageHeader>

    <AppAlert v-if="model.error" variant="danger" :message="model.error" />
    <AppAlert v-if="!building && !buildings.loading" variant="warning" message="Galpao nao carregado. Volte para a lista e abra um galpao." />

    <div v-if="model.modulation" class="summary-grid">
      <AppCard>
        <h2>Porticos</h2>
        <p class="metric">{{ model.modulation.repeatCount }}</p>
      </AppCard>
      <AppCard>
        <h2>Espacamento</h2>
        <p class="metric">{{ model.modulation.frameSpacing }} m</p>
      </AppCard>
      <AppCard>
        <h2>Profundidade</h2>
        <p class="metric">{{ buildingDepth }} m</p>
      </AppCard>
    </div>

    <div v-if="model.modulation" class="split wide-split">
      <AppCard>
        <h2>Portico tipo</h2>
        <FrameGeometryForm
          :modulation-id="model.modulation.id"
          :roof-slope-percent="building?.roofSlopePercent ?? 5"
          :frame-spacing="model.modulation.frameSpacing"
          :loading="model.loading"
          @submit="generate"
        />
      </AppCard>
      <AppCard>
        <BuildingViewer3D v-if="model.frame" :modulation="model.modulation" :frame="model.frame" />
        <AppEmptyState v-else title="Portico ainda nao gerado" message="Preencha as informacoes do portico para renderizar o galpao em 3D." />
        <div v-if="model.frame" class="form-actions">
          <AppButton @click="router.push(`/frames/${model.frame!.frameId}/loads`)">Ir para cargas</AppButton>
        </div>
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import BuildingViewer3D from '../components/domain/BuildingViewer3D.vue'
import FrameGeometryForm from '../components/domain/FrameGeometryForm.vue'
import AppAlert from '../components/ui/AppAlert.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppEmptyState from '../components/ui/AppEmptyState.vue'
import AppPageHeader from '../components/ui/AppPageHeader.vue'
import { useBuildingStore } from '../stores/buildings'
import { useModelStore } from '../stores/model'

const route = useRoute()
const router = useRouter()
const buildings = useBuildingStore()
const model = useModelStore()
const buildingId = computed(() => String(route.params.buildingId))
const modulationId = computed(() => String(route.params.modulationId))
const building = computed(() => buildings.current ?? buildings.buildings.find((item) => item.id === buildingId.value) ?? null)
const buildingDepth = computed(() => {
  if (!model.modulation) return 0
  return Math.max(model.modulation.repeatCount - 1, 0) * model.modulation.frameSpacing
})

onMounted(async () => {
  if (!buildings.buildings.length) await buildings.loadBuildings()
  buildings.setCurrent(buildingId.value)
  await model.loadModulation(modulationId.value)
})

async function generate(input: Parameters<typeof model.generateFrame>[0]) {
  await model.generateFrame(input)
}
</script>
