<template>
  <AppCard>
    <div class="building-card">
      <div>
        <h2>{{ building.name }}</h2>
        <p class="muted">{{ building.roofSlopePercent }}% de inclinacao</p>
      </div>
      <dl>
        <div><dt>Modulacoes</dt><dd>{{ building.modulationCount ?? building.modulations?.length ?? 0 }}</dd></div>
      </dl>
      <AppButton @click="$emit('open', building)">Abrir modulacoes</AppButton>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { Building } from '../../types'
import AppButton from '../ui/AppButton.vue'
import AppCard from '../ui/AppCard.vue'

defineProps<{ building: Building }>()
defineEmits<{ open: [building: Building] }>()
</script>
