import { defineStore } from 'pinia'
import { apiRequest, ApiError } from '../services/api'
import type { User } from '../types'

type AuthResponse = {
  user: User
  expiresInSeconds?: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    checked: false,
    loading: false,
    error: '',
  }),
  actions: {
    async loadMe() {
      this.loading = true
      try {
        const response = await apiRequest<AuthResponse>('/auth/me')
        this.user = response.user
      } catch {
        this.user = null
      } finally {
        this.checked = true
        this.loading = false
      }
    },
    async login(email: string, password: string) {
      await this.authenticate('/auth/login', email, password)
    },
    async register(email: string, password: string) {
      await this.authenticate('/auth/register', email, password)
    },
    async authenticate(path: string, email: string, password: string) {
      this.loading = true
      this.error = ''
      try {
        const response = await apiRequest<AuthResponse>(path, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
        this.user = response.user
        this.checked = true
      } catch (error) {
        this.error = error instanceof ApiError ? error.message : 'Falha na autenticacao.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async logout() {
      await apiRequest('/auth/logout', { method: 'POST' }).catch(() => null)
      this.user = null
      this.checked = true
    },
  },
})
