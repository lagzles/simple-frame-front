<template>
  <AppCard>
    <div class="status-panel">
      <AppBadge :label="job?.status ?? 'sem job'" :variant="variant" />
      <AppProgressBar :value="job?.progress ?? 0" :label="stepLabel" />
      <AppAlert v-if="error" variant="danger" title="Erro" :message="error" />
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AnalysisJob } from '../../types'
import AppAlert from '../ui/AppAlert.vue'
import AppBadge from '../ui/AppBadge.vue'
import AppCard from '../ui/AppCard.vue'
import AppProgressBar from '../ui/AppProgressBar.vue'

const props = defineProps<{ job: AnalysisJob | null; error?: string }>()
const variant = computed(() => props.job?.status === 'completed' ? 'success' : props.job?.status === 'failed' ? 'danger' : 'warning')
const stepLabel = computed(() => props.job?.currentStep?.replaceAll('_', ' ') ?? 'Aguardando')
</script>
