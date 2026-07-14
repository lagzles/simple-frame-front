<template>
  <AppLayout>
    <AppPageHeader title="Resultados" subtitle="Resumo e detalhes retornados pelo backend." />
    <AppAlert v-if="error" variant="danger" :message="error" />
    <div v-if="summary" class="summary-grid">
      <AppCard><strong>Barra crítica</strong><span>{{ summary.criticalMemberKey ?? '-' }}</span></AppCard>
      <AppCard><strong>ELU máx.</strong><span>{{ summary.maxEluRatio ?? '-' }}</span></AppCard>
      <AppCard><strong>ELS máx.</strong><span>{{ summary.maxElsRatio ?? '-' }}</span></AppCard>
      <AppCard><strong>Status</strong><span>{{ summary.status ?? 'concluído' }}</span></AppCard>
    </div>
    <AppCard>
      <h2>Dados brutos</h2>
      <pre>{{ formatted }}</pre>
    </AppCard>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import AppAlert from '../components/ui/AppAlert.vue'
import AppCard from '../components/ui/AppCard.vue'
import AppPageHeader from '../components/ui/AppPageHeader.vue'
import { useAnalysisStore } from '../stores/analysis'

const route = useRoute()
const analysis = useAnalysisStore()
const error = ref('')

const result = computed(() => analysis.results as { summary?: Record<string, unknown> } | null)
const summary = computed(() => result.value?.summary)
const formatted = computed(() => JSON.stringify(analysis.results, null, 2))

onMounted(async () => {
  try {
    await analysis.loadResults(String(route.params.jobId))
  } catch {
    error.value = 'Resultado ainda não disponível ou sessão expirada.'
  }
})
</script>
