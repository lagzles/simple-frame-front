<template>
  <AppCard>
    <div class="building-card">
      <div>
        <h2>{{ building.name }}</h2>
        <p>{{ roofLabel }} · {{ building.frameCount }} pórticos · {{ building.frameSpacing }} m</p>
      </div>
      <dl>
        <div><dt>Altura</dt><dd>{{ building.freeHeight }} m</dd></div>
        <div><dt>Inclinação</dt><dd>{{ building.roofSlopePercent }}%</dd></div>
      </dl>
      <AppButton @click="$emit('open', building)">Abrir</AppButton>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Building } from '../../types'
import AppButton from '../ui/AppButton.vue'
import AppCard from '../ui/AppCard.vue'

const props = defineProps<{ building: Building }>()
defineEmits<{ open: [building: Building] }>()
const roofLabel = computed(() => (props.building.roofType === 'double_slope' ? 'Duas águas' : 'Uma água'))
</script>
