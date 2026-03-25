import { z } from 'zod'

export const alertLevelSchema = z.enum(['info', 'warn', 'error'])

export const dashboardAlertSchema = z.object({
  level: alertLevelSchema,
  message: z.string()
})

export const dashboardMetaSchema = z.object({
  source: z.string(),
  generatedAt: z.string(),
  status: z.enum(['ok', 'degraded', 'error'])
})

export const dashboardSummarySchema = z.object({
  activePlayers: z.number().nonnegative(),
  matches24h: z.number().nonnegative(),
  avgKdr: z.number().nonnegative(),
  avgWinRate: z.number().min(0).max(1)
})

export const trendPointSchema = z.object({
  timestamp: z.string(),
  activePlayers: z.number().nonnegative(),
  matches: z.number().nonnegative()
})

export const playerRowSchema = z.object({
  playerId: z.string(),
  name: z.string(),
  platform: z.string(),
  kdr: z.number().nonnegative(),
  winRate: z.number().min(0).max(1),
  matches: z.number().nonnegative()
})

export const dashboardDataSchema = z.object({
  meta: dashboardMetaSchema,
  summary: dashboardSummarySchema,
  trend: z.array(trendPointSchema),
  topPlayers: z.array(playerRowSchema),
  alerts: z.array(dashboardAlertSchema)
})

export function createFallbackDashboardData(errorMessage: string) {
  return dashboardDataSchema.parse({
    meta: {
      source: 'fallback',
      generatedAt: new Date(0).toISOString(),
      status: 'error'
    },
    summary: {
      activePlayers: 0,
      matches24h: 0,
      avgKdr: 0,
      avgWinRate: 0
    },
    trend: [],
    topPlayers: [],
    alerts: [
      {
        level: 'error',
        message: errorMessage
      }
    ]
  })
}
