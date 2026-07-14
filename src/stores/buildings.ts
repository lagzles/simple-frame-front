import { defineStore } from 'pinia'
import { apiRequest } from '../services/api'
import type { Building, RoofType } from '../types'

export type BuildingInput = {
  name: string
  frameSpacing: number
  frameCount: number
  freeHeight: number
  roofType: RoofType
  roofSlopePercent: number
}

export const useBuildingStore = defineStore('buildings', {
  state: () => ({
    buildings: [] as Building[],
    current: null as Building | null,
    loading: false,
    error: '',
  }),
  actions: {
    async loadBuildings() {
      this.loading = true
      this.error = ''
      try {
        const response = await apiRequest<{ buildings: Building[] }>('/buildings')
        this.buildings = response.buildings
      } catch {
        this.error = 'Nao foi possivel carregar os predios.'
      } finally {
        this.loading = false
      }
    },
    async createBuilding(input: BuildingInput) {
      const building = await apiRequest<Building>('/buildings', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      this.buildings = [building, ...this.buildings]
      this.current = building
      return building
    },
    setCurrent(buildingId: string) {
      this.current = this.buildings.find((building) => building.id === buildingId) ?? null
    },
  },
})
