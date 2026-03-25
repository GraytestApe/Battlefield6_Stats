interface SummaryCardProps {
  label: string
  value: string
  subtext?: string
}

export function SummaryCard({ label, value, subtext }: SummaryCardProps) {
  return (
    <article className="card summary-card">
      <p className="summary-label">{label}</p>
      <p className="summary-value">{value}</p>
      {subtext ? <p className="summary-subtext">{subtext}</p> : null}
    </article>
  )
}
