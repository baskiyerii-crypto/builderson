import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BuilderCanvasPanel, BuilderDndRoot } from '@/components/builder/BuilderCanvas'
import { BuilderBreadcrumb } from '@/components/builder/BuilderBreadcrumb'
import { BuilderFloatingLeftDock } from '@/components/builder/BuilderFloatingLeftDock'
import { BuilderRightInspector } from '@/components/builder/BuilderRightInspector'
import { BuilderJsonOverlay } from '@/components/builder/BuilderJsonOverlay'
import { BuilderPreviewOverlay } from '@/components/builder/BuilderPreviewOverlay'
import { BuilderTopBar } from '@/components/builder/BuilderTopBar'
import { CanvasQuickToolbar } from '@/components/builder/CanvasQuickToolbar'
import { BlockLayersTreePanel } from '@/components/builder/BlockLibrary'
import { useProject } from '@/context/ProjectContext'

/** Wix tarzı düzenleyici: açık krom, tam pencere yüzeyi */
export function BuilderPage() {
  const nav = useNavigate()
  const { project } = useProject()
  const shellRef = useRef<HTMLDivElement>(null)
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false)
  const [jsonOpen, setJsonOpen] = useState(false)
  const [navigatorOpen, setNavigatorOpen] = useState(false)
  const [browserFullscreen, setBrowserFullscreen] = useState(false)

  useEffect(() => {
    if (!project.siteType) nav('/')
    else if (!project.headerTemplateId) nav('/setup/shell')
  }, [project.siteType, project.headerTemplateId, nav])

  useEffect(() => {
    const onFs = () => setBrowserFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const toggleBrowserFullscreen = async () => {
    const el = shellRef.current
    if (!el) return
    try {
      if (!document.fullscreenElement) await el.requestFullscreen()
      else await document.exitFullscreen()
    } catch {
      /* bazı tarayıcılar / iframe politikaları reddedebilir */
    }
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const disabled = project.role === 'client'

  return (
    <div
      ref={shellRef}
      className="fixed inset-0 z-50 flex min-h-0 flex-col overflow-hidden bg-[#dfe3e8] text-slate-800 antialiased"
    >
      <BuilderPreviewOverlay open={fullPreviewOpen} onClose={() => setFullPreviewOpen(false)} />
      <BuilderJsonOverlay open={jsonOpen} onClose={() => setJsonOpen(false)} />

      <BuilderTopBar
        onOpenNavigator={() => setNavigatorOpen((o) => !o)}
        onFullPreview={() => setFullPreviewOpen(true)}
        onJson={() => setJsonOpen(true)}
        onExport={exportJson}
        onBrowserFullscreen={toggleBrowserFullscreen}
        browserFullscreen={browserFullscreen}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <BuilderDndRoot>
          <>
            <div className="flex min-h-0 min-w-0 flex-1 flex-row">
            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
              {navigatorOpen ? (
                <div className="absolute left-3 top-3 z-40 flex max-h-[min(72dvh,540px)] w-[min(calc(100vw-1.5rem),23rem)] flex-col overflow-hidden rounded-lg border border-[#c9ced6] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                  <div className="flex items-center justify-between border-b border-[#e8eaed] bg-[#f7f8fa] px-3 py-2">
                    <p className="text-xs font-semibold text-slate-700">Gezgin</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-slate-500 hover:text-slate-900"
                      aria-label="Kapat"
                      onClick={() => setNavigatorOpen(false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-hidden bg-white">
                    <BlockLayersTreePanel disabled={disabled} />
                  </div>
                </div>
              ) : null}
              <CanvasQuickToolbar />
              <BuilderBreadcrumb />
              <BuilderCanvasPanel />
            </div>
            <BuilderRightInspector />
            </div>
            <BuilderFloatingLeftDock />
          </>
        </BuilderDndRoot>
      </div>

      <div className="flex h-7 shrink-0 items-center justify-end gap-4 border-t border-[#c9ced6] bg-white px-3 text-[10px] text-slate-500">
        <span>Tüm değişiklikler kaydedildi</span>
        <Link
          to="/preview"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[#116dff] hover:underline"
        >
          Siteyi önizle
        </Link>
      </div>
    </div>
  )
}
