<template>
  <AppCard>
    <div class="frame-card">
      <div>
        <h2>{{ modulation.name }}</h2>
        <p class="muted">{{ frameSummary }}</p>
      </div>
      <dl>
        <div><dt>Ordem</dt><dd>{{ modulation.orderIndex }}</dd></div>
        <div><dt>Porticos</dt><dd>{{ modulation.repeatCount }}</dd></div>
        <div><dt>Espacamento</dt><dd>{{ modulation.frameSpacing }} m</dd></div>
      </dl>
      <AppButton @click="$emit('open', modulation)">Abrir</AppButton>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Modulation } from '../../types'
import AppButton from '../ui/AppButton.vue'
import AppCard from '../ui/AppCard.vue'

const props = defineProps<{ modulation: Modulation }>()
defineEmits<{ open: [modulation: Modulation] }>()

const frameSummary = computed(() => {
  const frame = props.modulation.frames[0]
  if (!frame) return 'Portico ainda nao gerado'
  return `${frame.name} - vao total ${frame.spanList.reduce((sum, span) => sum + span, 0)} m`
})
</script>
