<template>
  <AppLayout>
    <AppPageHeader title="Prédios" subtitle="Galpões vinculados ao usuário autenticado.">
      <template #actions>
        <AppButton @click="showForm = !showForm">{{ showForm ? 'Fechar' : 'Novo prédio' }}</AppButton>
      </template>
    </AppPageHeader>

    <AppCard v-if="showForm" class="section">
      <BuildingForm :loading="buildings.loading" @submit="create" />
    </AppCard>

    <AppAlert v-if="buildings.error" variant="danger" :message="buildings.error" />
    <AppEmptyState v-if="!buildings.loading && !buildings.buildings.length" title="Nenhum prédio criado" message="Crie o primeiro galpão para iniciar a modelagem." />

    <div class="grid-list">
      <BuildingCard v-for="building in buildings.buildings" :key="building.id" :building="building" @open="open" />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import BuildingCard from '../components/domain/BuildingCard.vue'
import BuildingForm from '../components/domain/BuildingForm.vue'
import AppAlert from '../components/ui/AppAlert.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppEmptyState from '../components/ui/AppEmptyState.vue'
import AppPageHeader from '../components/ui/AppPageHeader.vue'
import { useBuildingStore, type BuildingInput } from '../stores/buildings'
import type { Building } from '../types'

const router = useRouter()
const buildings = useBuildingStore()
const showForm = ref(false)

onMounted(() => buildings.loadBuildings())

async function create(input: BuildingInput) {
  const building = await buildings.createBuilding(input)
  showForm.value = false
  await router.push(`/buildings/${building.id}/model`)
}

async function open(building: Building) {
  buildings.current = building
  await router.push(`/buildings/${building.id}/model`)
}
</script>
