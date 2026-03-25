import { format } from 'date-fns'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { dashboardData, dashboardDataParseError } from './data'
import { SectionCard } from './components/SectionCard'
import { SummaryCard } from './components/SummaryCard'

const numberFormatter = new Intl.NumberFormat('en-US')

function asPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export default function App() {
  const generatedDate = new Date(dashboardData.meta.generatedAt)

  return (
    <main className="container">
      <header className="hero card">
        <div>
          <p className="eyebrow">Public Dashboard</p>
          <h1>Battlefield 6 Stats Overview</h1>
          <p className="subtitle">
            Automatically rebuilt every 15 minutes from upstream API data.
          </p>
        </div>
        <div className="last-updated">
          <span>Last Updated</span>
          <strong>{format(generatedDate, "MMM d, yyyy 'at' HH:mm 'UTC'")}</strong>
          <span className={`status status-${dashboardData.meta.status}`}>
            Pipeline status: {dashboardData.meta.status}
          </span>
        </div>
      </header>

      {dashboardDataParseError ? (
        <section className="card" role="alert" aria-live="assertive">
          <strong>Data validation warning:</strong> {dashboardDataParseError}
        </section>
      ) : null}

      <section className="summary-grid">
        <SummaryCard
          label="Active Players"
          value={numberFormatter.format(dashboardData.summary.activePlayers)}
        />
        <SummaryCard
          label="Matches (24h)"
          value={numberFormatter.format(dashboardData.summary.matches24h)}
        />
        <SummaryCard label="Average K/D" value={dashboardData.summary.avgKdr.toFixed(2)} />
        <SummaryCard label="Average Win Rate" value={asPercent(dashboardData.summary.avgWinRate)} />
      </section>

      <div className="content-grid">
        <SectionCard title="Activity Trend" subtitle="Recent snapshots from the data pipeline">
          {dashboardData.trend.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dashboardData.trend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value: string) => format(new Date(value), 'HH:mm')}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, key) => [numberFormatter.format(Number(value ?? 0)), String(key)]}
                    labelFormatter={(label) => format(new Date(String(label)), "MMM d, HH:mm 'UTC'")}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="activePlayers" stroke="#4f46e5" />
                  <Line yAxisId="right" type="monotone" dataKey="matches" stroke="#0ea5e9" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="muted">No trend data available yet.</p>
          )}
        </SectionCard>

        <SectionCard title="Top Players" subtitle="Most active competitors from latest refresh">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Platform</th>
                  <th>Matches</th>
                  <th>K/D</th>
                  <th>Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.topPlayers.map((player) => (
                  <tr key={player.playerId}>
                    <td>{player.name}</td>
                    <td>{player.platform}</td>
                    <td>{numberFormatter.format(player.matches)}</td>
                    <td>{player.kdr.toFixed(2)}</td>
                    <td>{asPercent(player.winRate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {dashboardData.alerts.length > 0 ? (
        <SectionCard title="Pipeline Alerts">
          <ul className="alerts">
            {dashboardData.alerts.map((alert) => (
              <li key={alert.message} className={`alert alert-${alert.level}`}>
                {alert.message}
              </li>
            ))}
          </ul>
        </SectionCard>
      ) : null}
    </main>
  )
}
