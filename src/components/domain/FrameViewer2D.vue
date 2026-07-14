<template>
  <svg class="frame-viewer" viewBox="0 0 900 420" role="img" aria-label="Pórtico 2D">
    <g :transform="transform">
      <line v-for="member in membersWithNodes" :key="member.key" :x1="member.start.x" :y1="-member.start.y" :x2="member.end.x" :y2="-member.end.y" class="member" />
      <g v-for="node in nodes" :key="node.key">
        <circle :cx="node.x" :cy="-node.y" r="0.18" class="node" />
        <path v-if="node.supportType !== 'none'" :d="supportPath(node.x, -node.y)" class="support" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FrameMember, FrameNode } from '../../types'

const props = defineProps<{ nodes: FrameNode[]; members: FrameMember[] }>()

const nodeByKey = computed(() => new Map(props.nodes.map((node) => [node.key, node])))
const membersWithNodes = computed(() =>
  props.members
    .map((member) => ({ ...member, start: nodeByKey.value.get(member.startNodeKey), end: nodeByKey.value.get(member.endNodeKey) }))
    .filter((member): member is FrameMember & { start: FrameNode; end: FrameNode } => Boolean(member.start && member.end)),
)

const bounds = computed(() => {
  const xs = props.nodes.map((node) => node.x)
  const ys = props.nodes.map((node) => node.y)
  return {
    minX: Math.min(...xs, 0),
    maxX: Math.max(...xs, 1),
    maxY: Math.max(...ys, 1),
  }
})

const transform = computed(() => {
  const width = bounds.value.maxX - bounds.value.minX
  const scale = Math.min(760 / width, 320 / bounds.value.maxY)
  return `translate(70 360) scale(${scale}) translate(${-bounds.value.minX} 0)`
})

function supportPath(x: number, y: number) {
  return `M ${x - 0.35} ${y + 0.35} L ${x + 0.35} ${y + 0.35} L ${x} ${y} Z`
}
</script>
