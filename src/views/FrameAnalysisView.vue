<template>
  <AppLayout>
    <AppPageHeader title="Análise" subtitle="Crie um job e acompanhe o progresso por SSE.">
      <template #actions>
        <AppButton @click="start">Iniciar análise</AppButton>
      </template>
    </AppPageHeader>
    <div class="split">
      <AnalysisStatusPanel :job="analysis.job" :error="analysis.error" />
      <AppCard>
        <FrameViewer2D v-if="model.frame" :nodes="model.frame.nodes" :members="model.frame.members" />
        <AppAlert v-else variant="warning" message="Modelo de pórtico não está carregado nesta sessão." />
        <div v-if="analysis.job?.status === 'completed'" class="form-actions">
          <AppButton @click="router.push(`/analysis-jobs/${analysis.job!.jobId}/results`)">Abrir resultados</AppButton>
        </div>
      </AppCard>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import AnalysisStatusPanel from '../components/domain/AnalysisStatusPanel.vue'
import FrameViewer2D from '../components/domain/FrameViewer2D.vue'
import AppAlert from '../components/ui/AppAlert.vue'
import AppButton from '../components/ui/AppButton.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppPageHeader from '../components/ui/AppPageHeader.vue'
import { useAnalysisStore } from '../stores/analysis'
import { useBuildingStore } from '../stores/buildings'
import { useModelStore } from '../stores/model'

const route = useRoute()
const router = useRouter()
const analysis = useAnalysisStore()
const buildings = useBuildingStore()
const model = useModelStore()
const buildingId = computed(() => buildings.current?.id ?? buildings.buildings[0]?.id ?? '')

async function start() {
  const response = await analysis.createJob(buildingId.value, String(route.params.frameId))
  analysis.subscribe(response.eventsUrl, (jobId) => {
    void analysis.loadResults(jobId)
  })
}
</script>
