import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dashboardData } from './data'
import { SectionCard } from './components/SectionCard'
import { SummaryCard } from './components/SummaryCard'

const numberFormatter = new Intl.NumberFormat('en-US')
const timestampFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'UTC'
})

function asPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function formatUtc(timestamp: string) {
  return `${timestampFormatter.format(new Date(timestamp))} UTC`
}

export default function App() {
  const generatedAt = dashboardData.meta.generatedAt

  return (
    <main className="container">
      <header className="hero card">
        <div>
          <p className="eyebrow">Public Dashboard</p>
          <h1>Battlefield 6 Stats Overview</h1>
          <p className="subtitle">Live API data for configured player tags, rebuilt as a static GitHub Pages dashboard.</p>
        </div>

        <div className="last-updated">
          <span>Last Updated</span>
          <strong>{formatUtc(generatedAt)}</strong>
          <span className={`status status-${dashboardData.meta.status}`}>Pipeline status: {dashboardData.meta.status}</span>
        </div>
      </header>

      <section className="summary-grid">
        <SummaryCard label="Active Players" value={numberFormatter.format(dashboardData.summary.activePlayers)} />
        <SummaryCard label="Matches (24h)" value={numberFormatter.format(dashboardData.summary.matches24h)} />
        <SummaryCard label="Average K/D" value={dashboardData.summary.avgKdr.toFixed(2)} />
        <SummaryCard label="Average Win Rate" value={asPercent(dashboardData.summary.avgWinRate)} />
      </section>

      <div className="content-grid">
        <SectionCard title="Activity Trend" subtitle="Recent snapshots from the latest refresh window">
          {dashboardData.trend.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.trend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbe2ea" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value: string) =>
                      new Date(value).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        timeZone: 'UTC'
                      })
                    }
                    tick={{ fill: '#4b5563', fontSize: 12 }}
                  />
                  <YAxis yAxisId="left" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, key) => {
                      const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
                      return [numberFormatter.format(numericValue), String(key)]
                    }}
                    labelFormatter={(label) => formatUtc(String(label ?? ''))}
                    contentStyle={{ borderRadius: 10, borderColor: '#e5e7eb' }}
                  />
                  <Legend />
                  <Line name="Active Players" yAxisId="left" type="monotone" dataKey="activePlayers" stroke="#4f46e5" strokeWidth={2} dot={false} />
                  <Line name="Matches" yAxisId="right" type="monotone" dataKey="matches" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="muted">No trend data available yet.</p>
          )}
        </SectionCard>

        <SectionCard title="Top Players" subtitle="Configured Battlefield player tags from the latest refresh">
          {dashboardData.topPlayers.length > 0 ? (
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
          ) : (
            <p className="muted">No player list is available for this refresh.</p>
          )}
        </SectionCard>
      </div>

      {dashboardData.alerts.length > 0 ? (
        <SectionCard title="Pipeline Alerts" subtitle="These messages are generated during API normalization.">
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
