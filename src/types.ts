import { z } from 'zod'
import {
  alertLevelSchema,
  dashboardAlertSchema,
  dashboardDataSchema,
  dashboardMetaSchema,
  dashboardSummarySchema,
  playerRowSchema,
  trendPointSchema
} from './schema'

export type AlertLevel = z.infer<typeof alertLevelSchema>
export type DashboardAlert = z.infer<typeof dashboardAlertSchema>
export type DashboardMeta = z.infer<typeof dashboardMetaSchema>
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>
export type TrendPoint = z.infer<typeof trendPointSchema>
export type PlayerRow = z.infer<typeof playerRowSchema>
export type DashboardData = z.infer<typeof dashboardDataSchema>
