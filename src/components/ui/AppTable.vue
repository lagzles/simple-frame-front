<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th v-for="column in columns" :key="column.key">{{ column.label }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="String(row[rowKey])" :class="{ selected: selectedKey && row[rowKey] === selectedKey }" @click="$emit('rowClick', row)">
          <td v-for="column in columns" :key="column.key">{{ row[column.key] ?? '-' }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="!rows.length" class="muted">{{ emptyMessage }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  columns: { key: string; label: string }[]
  rows: Record<string, unknown>[]
  rowKey: string
  selectedKey?: string
  emptyMessage?: string
}>()
defineEmits<{ rowClick: [row: Record<string, unknown>] }>()
</script>
