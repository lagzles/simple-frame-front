import { API_BASE_URL } from '../env'

export type ApiErrorPayload = {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
}

export class ApiError extends Error {
  code: string
  status: number
  details: unknown

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.error?.message ?? 'Erro de API')
    this.status = status
    this.code = payload.error?.code ?? 'API_ERROR'
    this.details = payload.error?.details ?? null
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorPayload
    throw new ApiError(response.status, payload)
  }

  return (await response.json()) as T
}
