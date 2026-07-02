import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Box,
  FileText,
  Heading,
  ImageIcon,
  Layers,
  LayoutGrid,
  MousePointerClick,
  Rows,
  SeparatorHorizontal,
  Space,
  Type,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { allowedZonesForBlock } from '@/lib/templates'
import { applyBodyThemePreset, type PageThemeId } from '@/lib/page-themes'
import type { BlockType } from '@/types/project'
import { BlockLayersTreePanel, ButtonKindPalette, LibraryInsertPanel } from '@/components/builder/BlockLibrary'
import { useProject } from '@/context/ProjectContext'

type LeftTab = 'pages' | 'widgets' | 'actions' | 'library' | 'layers'

const tabMeta: Record<LeftTab, { label: string; title: string }> = {
  pages: { label: 'Sayfalar', title: 'Sayfalar ve tema' },
  widgets: { label: 'Bileşen', title: 'Hızlı bileşenler' },
  actions: { label: 'Butonlar', title: 'Butonlar ve formlar' },
  library: { label: 'Kütüphane', title: 'Kütüphane' },
  layers: { label: 'Katman', title: 'Katmanlar' },
}

const primitives: { type: BlockType; label: string; icon: typeof Type }[] = [
  { type: 'heading', label: 'Başlık', icon: Heading },
  { type: 'text', label: 'Metin', icon: Type },
  { type: 'photo', label: 'Görsel', icon: ImageIcon },
  { type: 'hero', label: 'Hero', icon: ImageIcon },
  { type: 'row-2', label: '2 sütun', icon: Rows },
  { type: 'image-text', label: 'Görsel+metin', icon: ImageIcon },
  { type: 'cta', label: 'CTA', icon: Box },
  { type: 'spacer', label: 'Boşluk', icon: Space },
  { type: 'divider', label: 'Çizgi', icon: SeparatorHorizontal },
]

/** Sol ikonlar: ekranda yüzen kapsül; sekme tıklanınca yanında panel açılır */
export function BuilderFloatingLeftDock() {
  const { project, addBlock, applyBodyTheme } = useProject()
  const disabled = project.role === 'client'
  const shellRef = useRef<HTMLDivElement>(null)
  const [panel, setPanel] = useState<LeftTab | null>(null)

  useEffect(() => {
    if (panel === null) return
    const onDown = (e: MouseEvent) => {
      if (shellRef.current?.contains(e.target as Node)) return
      setPanel(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [panel])

  const addQuick = (type: BlockType) => {
    const zones = allowedZonesForBlock(type)
    const zone = zones.includes('body') ? 'body' : zones[0]
    addBlock(zone, type, undefined, true)
  }

  const applyTheme = (id: PageThemeId) => {
    if (!project.siteType) return
    if (
      !window.confirm(
        'Gövde blokları seçilen tema ile değiştirilecek. Devam edilsin mi?',
      )
    ) {
      return
    }
    applyBodyTheme(applyBodyThemePreset(id, project.siteType))
  }

  const railBtn = (t: LeftTab, icon: ReactNode) => (
    <button
      key={t}
      type="button"
      title={tabMeta[t].label}
      onClick={() => setPanel((c) => (c === t ? null : t))}
      className={cn(
        'flex size-10 items-center justify-center rounded-xl transition-colors',
        panel === t
          ? 'bg-[#e8f1fe] text-[#116dff] shadow-sm'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
      )}
    >
      {icon}
    </button>
  )

  return (
    <div
      ref={shellRef}
      className="pointer-events-none fixed left-3 top-1/2 z-[60] flex -translate-y-1/2 flex-row items-start gap-2 sm:left-4"
    >
      <div className="pointer-events-auto flex max-h-[min(78dvh,640px)] flex-row items-stretch gap-2">
        <nav
          className="flex flex-col items-center gap-1 rounded-2xl border border-[#c9ced6] bg-white/95 py-2.5 pl-2 pr-2 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-md"
          aria-label="Sol menü"
        >
          {railBtn('pages', <FileText className="size-5" />)}
          {railBtn('widgets', <Box className="size-5" />)}
          {railBtn('actions', <MousePointerClick className="size-5" />)}
          {railBtn('library', <LayoutGrid className="size-5" />)}
          {railBtn('layers', <Layers className="size-5" />)}
        </nav>

        {panel !== null ? (
          <aside className="flex max-h-full min-h-0 w-[min(calc(100vw-5.5rem),22rem)] min-w-0 flex-col self-stretch overflow-hidden rounded-2xl border border-[#c9ced6] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.14)] sm:w-96">
            <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[#e8eaed] bg-[#f7f8fa] px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{tabMeta[panel].title}</p>
                <p className="text-[11px] text-slate-500">{tabMeta[panel].label}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-slate-500 hover:text-slate-900"
                aria-label="Paneli kapat"
                onClick={() => setPanel(null)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden text-slate-800">
              {panel === 'pages' ? (
                <div className="flex max-h-[min(60dvh,480px)] flex-col gap-3 overflow-y-auto p-3">
                  <div className="rounded-lg border border-[#e8eaed] bg-[#f7f8fa] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Sayfa
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">Ana sayfa</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Tek sayfa düzeni (çoklu sayfa yakında)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Hazır gövde teması
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-full border-[#c9ced6] text-xs"
                      disabled={disabled || !project.siteType}
                      onClick={() => applyTheme('corporate-landing')}
                    >
                      Kurumsal vitrin
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-full border-[#c9ced6] text-xs"
                      disabled={disabled || project.siteType !== 'ecommerce'}
                      onClick={() => applyTheme('ecommerce-landing')}
                    >
                      E-ticaret vitrin
                    </Button>
                  </div>
                </div>
              ) : null}
              {panel === 'widgets' ? (
                <div className="grid max-h-[min(60dvh,480px)] content-start gap-2 overflow-y-auto p-3 sm:grid-cols-2">
                  {primitives.map((p) => (
                    <Button
                      key={p.type}
                      type="button"
                      variant="outline"
                      disabled={disabled}
                      className="flex h-auto flex-col items-center gap-1 border-[#e8eaed] bg-white py-3 text-[10px] font-normal text-slate-700 shadow-sm hover:border-[#3899ec]/40 hover:bg-[#f7fbff]"
                      onClick={() => addQuick(p.type)}
                    >
                      <p.icon className="size-5 text-[#116dff]" />
                      {p.label}
                    </Button>
                  ))}
                </div>
              ) : null}
              {panel === 'actions' ? <ButtonKindPalette disabled={disabled} /> : null}
              {panel === 'library' ? (
                <LibraryInsertPanel disabled={disabled} />
              ) : null}
              {panel === 'layers' ? <BlockLayersTreePanel disabled={disabled} /> : null}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  )
}
