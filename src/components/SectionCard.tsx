import type { PropsWithChildren } from 'react'

interface SectionCardProps extends PropsWithChildren {
  title: string
  subtitle?: string
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <section className="card section-card">
      <div className="section-heading">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}
