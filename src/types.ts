export type AlertLevel = 'info' | 'warn' | 'error'

export interface DashboardAlert {
  level: AlertLevel
  message: string
}

export interface DashboardMeta {
  source: string
  generatedAt: string
  status: 'ok' | 'degraded' | 'error'
}

export interface DashboardSummary {
  activePlayers: number
  matches24h: number
  avgKdr: number
  avgWinRate: number
}

export interface TrendPoint {
  timestamp: string
  activePlayers: number
  matches: number
}

export interface PlayerRow {
  playerId: string
  name: string
  platform: string
  kdr: number
  winRate: number
  matches: number
}

export interface DashboardData {
  meta: DashboardMeta
  summary: DashboardSummary
  trend: TrendPoint[]
  topPlayers: PlayerRow[]
  alerts: DashboardAlert[]
}
