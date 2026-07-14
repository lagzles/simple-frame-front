import { defineStore } from 'pinia'
import { API_BASE_URL } from '../env'
import { apiRequest } from '../services/api'
import type { AnalysisJob } from '../types'

export const useAnalysisStore = defineStore('analysis', {
  state: () => ({
    job: null as AnalysisJob | null,
    results: null as unknown,
    error: '',
  }),
  actions: {
    async createJob(buildingId: string, frameId?: string) {
      this.error = ''
      const response = await apiRequest<{
        jobId: string
        status: AnalysisJob['status']
        eventsUrl: string
        resultsUrl: string
      }>('/analysis-jobs', {
        method: 'POST',
        body: JSON.stringify({
          buildingId,
          frameId,
          options: { runChecks: true, optimizeProfiles: false },
        }),
      })
      this.job = {
        jobId: response.jobId,
        status: response.status,
        progress: 0,
        currentStep: 'queued',
        resultsUrl: response.resultsUrl,
      }
      return response
    },
    subscribe(eventsUrl: string, onCompleted: (jobId: string) => void) {
      const source = new EventSource(`${API_BASE_URL.replace('/api', '')}${eventsUrl}`, { withCredentials: true })
      const update = (event: MessageEvent) => {
        const data = JSON.parse(event.data) as AnalysisJob
        this.job = { ...(this.job ?? data), ...data }
      }
      source.addEventListener('progress', update)
      source.addEventListener('started', update)
      source.addEventListener('completed', (event) => {
        update(event as MessageEvent)
        source.close()
        if (this.job?.jobId) onCompleted(this.job.jobId)
      })
      source.addEventListener('failed', (event) => {
        update(event as MessageEvent)
        this.error = this.job?.errorMessage ?? 'Analise falhou.'
        source.close()
      })
      return source
    },
    async loadResults(jobId: string) {
      this.results = await apiRequest(`/analysis-jobs/${jobId}/results`)
      return this.results
    },
  },
})
