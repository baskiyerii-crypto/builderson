import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PagePreviewContent } from '@/components/builder/PagePreviewContent'
import { canvasMaxWidth, deviceLabel } from '@/lib/device-frame'
import { useProject } from '@/context/ProjectContext'

export function BuilderPreviewOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { project } = useProject()

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
      className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Tam ekran önizleme"
    >
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 px-4 text-white">
        <div>
          <p className="text-sm font-medium">Önizleme</p>
          <p className="text-[10px] text-zinc-400">{deviceLabel(project.device)}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="gap-1 border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          Kapat
        </Button>
      </header>
      <div className="flex min-h-0 flex-1 justify-center overflow-auto p-6">
        <div
          className="w-full rounded-lg border border-white/10 bg-background text-foreground shadow-2xl"
          style={{ maxWidth: canvasMaxWidth(project.device) }}
        >
          <div className="border-b bg-muted/50 px-4 py-2 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Canlı önizleme · {deviceLabel(project.device)}
          </div>
          <div className="p-6">
            <PagePreviewContent project={project} />
          </div>
        </div>
      </div>
    </div>
  )
}
