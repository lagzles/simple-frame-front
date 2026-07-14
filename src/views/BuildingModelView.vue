<template>
  <AppLayout>
    <AppPageHeader title="Modelagem" subtitle="Crie a modulação e gere o pórtico plano." />
    <AppAlert v-if="!building" variant="warning" message="Prédio não carregado. Volte para a lista e abra um prédio." />
    <div v-else class="split">
      <AppCard>
        <h2>{{ building.name }}</h2>
        <p class="muted">Primeiro criaremos uma modulação padrão, depois o pórtico.</p>
        <AppButton v-if="!model.modulation" @click="createModulation">Criar modulação padrão</AppButton>
        <FrameGeometryForm v-else :building="building" :modulation-id="model.modulation.id" :loading="model.loading" @submit="generate" />
        <AppAlert v-if="model.error" variant="danger" :message="model.error" />
      </AppCard>
      <AppCard>
        <FrameViewer2D v-if="model.frame" :nodes="model.frame.nodes" :members="model.frame.members" />
        <AppEmptyState v-else title="Pórtico ainda não gerado" message="Preencha a geometria para visualizar nós, barras e apoios." />
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
import FrameGeometryForm from '../components/domain/FrameGeometryForm.vue'
import FrameViewer2D from '../components/domain/FrameViewer2D.vue'
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
const building = computed(() => buildings.current ?? buildings.buildings.find((item) => item.id === buildingId.value) ?? null)

onMounted(async () => {
  if (!buildings.buildings.length) await buildings.loadBuildings()
  buildings.setCurrent(buildingId.value)
})

async function createModulation() {
  if (!building.value) return
  await model.createModulation(building.value.id, building.value.frameSpacing)
}

async function generate(input: Parameters<typeof model.generateFrame>[0]) {
  await model.generateFrame(input)
}
</script>
