export type User = {
  id: string
  email: string
}

export type RoofType = 'single_slope' | 'double_slope'

export type Building = {
  id: string
  name: string
  roofSlopePercent: number
  modulationCount: number
  modulations: Modulation[]
  createdAt: string
  updatedAt: string
}

export type Modulation = {
  id: string
  buildingId: string
  name: string
  orderIndex: number
  repeatCount: number
  frameSpacing: number
  frames: FrameModel[]
  createdAt: string
  updatedAt: string
}

export type FrameNode = {
  key: string
  x: number
  y: number
  supportType: string
}

export type FrameMember = {
  key: string
  startNodeKey: string
  endNodeKey: string
  type: string
  length: number
}

export type FrameModel = {
  frameId: string
  name: string
  spanList: number[]
  freeHeight: number
  ridgeX: number | null
  roofSlopePercent: number
  influenceWidth: number
  minimumWebHeight: number | null
  hasSteelColumns: boolean
  roofType: RoofType
  createdAt: string
  updatedAt: string
  nodes: FrameNode[]
  members: FrameMember[]
}

export type LoadCase = {
  caseKey: string
  orderIndex: number
  verticalLeft: number
  verticalRight: number
  horizontalLeft: number
  horizontalRight: number
}

export type AnalysisJobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

export type AnalysisJob = {
  jobId: string
  status: AnalysisJobStatus
  progress: number
  currentStep: string | null
  errorCode?: string | null
  errorMessage?: string | null
  resultsUrl?: string
}
