import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { BlockViews } from '@/blocks/BlockViews'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { findBlockWithZone } from '@/lib/block-tree'
import { useProject } from '@/context/ProjectContext'
import { BlockInspectorFields } from '@/components/builder/BlockInspectorFields'
import { BlockStylePanel } from '@/components/builder/BlockStylePanel'
import { cn } from '@/lib/utils'

/** Seçim varken sağda sabit panel + canlı önizleme. Önizleme kromunda kilit mesajı. */
export function BuilderRightInspector() {
  const { project, selection, setSelection, setPreviewChrome } = useProject()
  const [tab, setTab] = useState('content')

  const found = useMemo(() => {
    if (!selection) return null
    return findBlockWithZone(project, selection.id)
  }, [project, selection])

  useEffect(() => {
    if (selection && !findBlockWithZone(project, selection.id)) {
      setSelection(null)
    }
  }, [project, selection, setSelection])

  useEffect(() => {
    if (selection) setTab('content')
  }, [selection?.id])

  if (!selection || !found) {
    return null
  }

  const { block, zone } = found
  const locked = project.previewChrome

  return (
    <aside
      className={cn(
        'relative flex min-h-0 w-[380px] shrink-0 flex-col self-stretch border-l border-[#d3d8de] bg-white text-slate-800',
        'min-w-[300px] max-w-[min(560px,52vw)] resize-x overflow-auto shadow-[-6px_0_20px_rgba(15,23,42,0.06)]',
      )}
    >
      {locked ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-white/85 p-4 text-center backdrop-blur-sm">
          <p className="text-xs font-medium text-slate-700">Önizleme kromu açık</p>
          <p className="text-[11px] text-slate-500">Düzenlemek için düzenleme görünümüne dönün.</p>
          <Button type="button" size="sm" className="mt-1" onClick={() => setPreviewChrome(false)}>
            Düzenlemeye dön
          </Button>
        </div>
      ) : null}

      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#e8eaed] bg-[#f7f8fa] px-3 py-2">
        <p className="truncate text-xs font-semibold text-slate-800">Düzenle</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-slate-500 hover:text-slate-900"
          aria-label="Kapat"
          onClick={() => setSelection(null)}
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="shrink-0 border-b border-[#e8eaed] bg-slate-50/90 px-2 py-2">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Önizleme</p>
        <div className="flex max-h-52 min-h-[10rem] items-start justify-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner">
          <div className="pointer-events-none w-[140%] origin-top scale-[0.42] p-3 sm:w-[120%] sm:scale-[0.48]">
            <BlockViews
              block={block}
              selected={false}
              onSelect={() => {}}
              inlineEdit={false}
              readOnly
            />
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TabsList className="h-10 shrink-0 justify-start gap-0 rounded-none border-b border-[#e8eaed] bg-white px-1">
          {(
            [
              ['content', 'İçerik'],
              ['style', 'Düzen'],
              ['advanced', 'Gelişmiş'],
            ] as const
          ).map(([v, label]) => (
            <TabsTrigger
              key={v}
              value={v}
              disabled={locked}
              className={cn(
                'rounded-none border-b-2 border-transparent px-3 text-[11px] font-medium text-slate-500',
                'data-[state=active]:border-[#3899ec] data-[state=active]:bg-transparent data-[state=active]:text-[#116dff]',
              )}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          value="content"
          className="m-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
        >
          <ScrollArea className="min-h-0 min-w-0 flex-1">
            <div className={cn('min-w-0 p-3', locked && 'pointer-events-none opacity-40')}>
              <BlockInspectorFields block={block} zone={zone} dense />
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent
          value="style"
          className="m-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
        >
          <ScrollArea className="min-h-0 min-w-0 flex-1">
            <div className={cn('min-w-0 p-3', locked && 'pointer-events-none opacity-40')}>
              <BlockStylePanel block={block} zone={zone} />
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent
          value="advanced"
          className="m-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
        >
          <ScrollArea className="min-h-0 min-w-0 flex-1">
            <div className={cn('min-w-0 p-3', locked && 'pointer-events-none opacity-40')}>
              <pre className="whitespace-pre-wrap break-all rounded-lg border border-[#e8eaed] bg-[#f7f8fa] p-3 text-[10px] leading-relaxed text-slate-600">
                {JSON.stringify({ type: block.type, props: block.props, layout: block.layout }, null, 2)}
              </pre>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
