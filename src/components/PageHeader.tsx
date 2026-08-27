import type { ReactNode } from 'react'

export function PageHeader({
  title,
  lead,
  meta,
  actions,
}: {
  title: string
  lead: string
  meta?: string
  actions?: ReactNode
}) {
  return (
    <header className="page-header">
      <div className="page-heading-copy">
        <h1>{title}</h1>
        <p>{lead}</p>
      </div>
      {(meta || actions) && (
        <div className="page-header-side">
          {meta && <span className="page-meta">{meta}</span>}
          {actions}
        </div>
      )}
    </header>
  )
}
