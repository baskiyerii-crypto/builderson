import { ChevronRight } from 'lucide-react'
import { selectionBreadcrumb } from '@/lib/selection-breadcrumb'
import { useProject } from '@/context/ProjectContext'
import { cn } from '@/lib/utils'

export function BuilderBreadcrumb() {
  const { project, selection } = useProject()
  if (!selection) return null
  const crumbs = selectionBreadcrumb(project, selection)
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-0.5 border-b border-[#c9ced6] bg-[#f7f8fa] px-3 py-1.5 text-[11px] text-slate-500">
      {crumbs.map((c, i) => (
        <span key={`${c.id}-${i}`} className="flex items-center gap-0.5">
          {i > 0 ? <ChevronRight className="size-3 opacity-50" /> : null}
          <span
            className={cn(
              i === crumbs.length - 1 ? 'font-semibold text-[#116dff]' : 'text-slate-500',
            )}
          >
            {c.label}
          </span>
        </span>
      ))}
    </div>
  )
}
