import rawData from '../data/api-data.json'
import { createFallbackDashboardData, dashboardDataSchema } from './schema'
import type { DashboardData } from './types'

function parseDashboardData() {
  const parsed = dashboardDataSchema.safeParse(rawData)

  if (parsed.success) {
    return {
      dashboardData: parsed.data,
      parseError: null
    }
  }

  const parseError = `Dashboard data is invalid and fallback values are being shown. (${parsed.error.issues[0]?.message ?? 'Unknown schema error'})`

  return {
    dashboardData: createFallbackDashboardData(parseError),
    parseError
  }
}

const startupData = parseDashboardData()

export const dashboardData: DashboardData = startupData.dashboardData
export const dashboardDataParseError = startupData.parseError
