import { defineStore } from 'pinia'
import { apiRequest } from '../services/api'
import type { FrameModel, LoadCase, Modulation, RoofType } from '../types'

export const useModelStore = defineStore('model', {
  state: () => ({
    modulation: null as Modulation | null,
    frame: null as FrameModel | null,
    loadCases: [] as LoadCase[],
    loading: false,
    error: '',
  }),
  actions: {
    async createModulation(buildingId: string, frameSpacing: number) {
      this.modulation = await apiRequest<Modulation>(`/buildings/${buildingId}/modulations`, {
        method: 'POST',
        body: JSON.stringify({
          name: 'Modulacao A',
          orderIndex: 0,
          repeatCount: 1,
          frameSpacing,
        }),
      })
      return this.modulation
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
