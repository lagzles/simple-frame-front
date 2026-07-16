import { defineStore } from 'pinia'
import { apiRequest } from '../services/api'
import type { FrameModel, LoadCase, Modulation, RoofType } from '../types'

export type ModulationInput = {
  name: string
  orderIndex: number
  repeatCount: number
  frameSpacing: number
}

export const useModelStore = defineStore('model', {
  state: () => ({
    modulation: null as Modulation | null,
    modulations: [] as Modulation[],
    frame: null as FrameModel | null,
    loadCases: [] as LoadCase[],
    loading: false,
    error: '',
  }),
  actions: {
    async loadModulations(buildingId: string) {
      this.loading = true
      this.error = ''
      try {
        const response = await apiRequest<{ modulations: Modulation[] }>(`/buildings/${buildingId}/modulations`)
        this.modulations = response.modulations
      } catch {
        this.error = 'Nao foi possivel carregar as modulacoes.'
      } finally {
        this.loading = false
      }
    },
    async loadModulation(modulationId: string) {
      this.loading = true
      this.error = ''
      try {
        const response = await apiRequest<Modulation>(`/modulations/${modulationId}`)
        this.modulation = response
        this.frame = response.frames[0] ?? null
        return response
      } catch {
        this.error = 'Nao foi possivel carregar a modulacao.'
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },
    async createModulation(buildingId: string, input: ModulationInput) {
      this.loading = true
      this.error = ''
      try {
        const modulation = await apiRequest<Modulation>(`/buildings/${buildingId}/modulations`, {
          method: 'POST',
          body: JSON.stringify(input),
        })
        this.modulation = modulation
        this.modulations = [...this.modulations, modulation].sort((a, b) => a.orderIndex - b.orderIndex)
        return modulation
      } catch {
        this.error = 'Nao foi possivel criar a modulacao.'
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },
    async generateFrame(input: {
      modulationId: string
      name: string
      spanList: number[]
      freeHeight: number
      ridgeX?: number
      roofSlopePercent: number
      influenceWidth: number
      minimumWebHeight?: number
      hasSteelColumns: boolean
      roofType: RoofType
    }) {
      this.loading = true
      this.error = ''
      try {
        this.frame = await apiRequest<FrameModel>(`/modulations/${input.modulationId}/frames/generate`, {
          method: 'POST',
          body: JSON.stringify({
            name: input.name,
            spanList: input.spanList,
            freeHeight: input.freeHeight,
            ridgeX: input.ridgeX,
            roofSlopePercent: input.roofSlopePercent,
            influenceWidth: input.influenceWidth,
            minimumWebHeight: input.minimumWebHeight,
            hasSteelColumns: input.hasSteelColumns,
            roofType: input.roofType,
          }),
        })
        if (this.modulation) {
          this.modulation = { ...this.modulation, frames: [this.frame, ...this.modulation.frames] }
        }
        return this.frame
      } catch (error) {
        this.error = 'Nao foi possivel gerar o portico.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async saveLoadCases(frameId: string, surfaceLoads: { cp: number; sc: number; su: number; cv: number }) {
      const response = await apiRequest<{ loadCases: LoadCase[] }>(`/frames/${frameId}/load-cases`, {
        method: 'PUT',
        body: JSON.stringify({ surfaceLoads }),
      })
      this.loadCases = response.loadCases
      return response.loadCases
    },
  },
})
