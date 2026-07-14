<template>
  <AppLayout>
    <AppPageHeader title="Cargas" subtitle="Informe cargas superficiais e confira os casos gerados." />
    <div class="split">
      <AppCard>
        <LoadForm @submit="save" />
        <div v-if="model.frame" class="form-actions">
          <AppButton variant="secondary" @click="router.push(`/frames/${model.frame!.frameId}/analysis`)">Ir para análise</AppButton>
        </div>
      </AppCard>
      <AppCard>
        <FrameViewer2D v-if="model.frame" :nodes="model.frame.nodes" :members="model.frame.members" />
        <AppTable :columns="columns" :rows="rows" row-key="caseKey" empty-message="Nenhuma carga salva." />
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import FrameViewer2D from '../components/domain/FrameViewer2D.vue'
import LoadForm from '../components/domain/LoadForm.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppPageHeader from '../components/ui/AppPageHeader.vue'
import AppTable from '../components/ui/AppTable.vue'
import { useModelStore } from '../stores/model'

const route = useRoute()
const router = useRouter()
const model = useModelStore()

const columns = [
  { key: 'caseKey', label: 'Caso' },
  { key: 'orderIndex', label: 'Ordem' },
  { key: 'verticalLeft', label: 'Vert. Esq.' },
  { key: 'verticalRight', label: 'Vert. Dir.' },
  { key: 'horizontalLeft', label: 'Horiz. Esq.' },
  { key: 'horizontalRight', label: 'Horiz. Dir.' },
]

const rows = computed(() => model.loadCases as unknown as Record<string, unknown>[])

async function save(value: { cp: number; sc: number; su: number; cv: number }) {
  await model.saveLoadCases(String(route.params.frameId), value)
}
</script>
