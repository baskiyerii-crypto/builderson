import { useEffect } from 'react'
import { Copy, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProject } from '@/context/ProjectContext'

export function BuilderJsonOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { project } = useProject()
  const text = JSON.stringify(project, null, 2)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black/60 p-4 backdrop-blur-sm md:p-8"
      role="dialog"
      aria-modal
      aria-label="Site JSON"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
          <p className="text-sm font-semibold">Proje JSON</p>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void navigator.clipboard.writeText(text)}
            >
              <Copy className="mr-1 h-3.5 w-3.5" />
              Kopyala
            </Button>
            <Button type="button" size="icon" variant="ghost" onClick={onClose} aria-label="Kapat">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <pre className="min-h-0 flex-1 overflow-auto p-4 text-left text-[11px] leading-relaxed text-muted-foreground">
          {text}
        </pre>
      </div>
    </div>
  )
}
