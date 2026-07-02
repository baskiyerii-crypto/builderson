import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import {
  ChevronLeft,
  LayoutGrid,
  LayoutTemplate,
  MousePointerClick,
  Plus,
  Puzzle,
  Search,
  X,
} from 'lucide-react'
import { BlockViews } from '@/blocks/BlockViews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  canPlaceBlock,
  libraryItemsForSite,
  libraryItemsForSiteAndKind,
  libraryItemKey,
  mergeBlockProps,
  ORDER,
  type LibraryCategory,
  type LibraryItem,
  type LibraryKind,
} from '@/lib/templates'
import type { BlockInstance, CanvasZone } from '@/types/project'
import { useProject } from '@/context/ProjectContext'
import { LibraryPreviewFrame } from '@/components/builder/LibraryPreviewFrame'
import { withLibraryThumbnailChildren } from '@/lib/library-thumbnail-demo'
import { insertDropIdNested, insertDropIdRoot } from '@/lib/insert-drop-ids'
import { resolveLibraryThumbnail } from '@/lib/library-thumbnails'
import { cn } from '@/lib/utils'

type LibraryKindOrAll = LibraryKind | 'all'

const KIND_META: {
  kind: LibraryKindOrAll
  label: string
  hint: string
  Icon: typeof LayoutGrid
}[] = [
  { kind: 'all', label: 'Tümü', hint: 'Hepsi', Icon: LayoutGrid },
  { kind: 'section', label: 'Bölüm', hint: 'Geniş alanlar', Icon: LayoutTemplate },
  { kind: 'component', label: 'Bileşen', hint: 'Metin vb.', Icon: Puzzle },
  { kind: 'button', label: 'Aksiyon', hint: 'CTA vb.', Icon: MousePointerClick },
]

function InsertPreviewCard({
  demo,
  title,
  thumbnailSrc,
  onPick,
}: {
  demo: BlockInstance
  title: string
  thumbnailSrc: string
  onPick: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'group/pick flex flex-col overflow-hidden rounded-lg border border-border/70 bg-card text-left shadow-sm transition-all',
        'hover:border-primary/45 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
      )}
      onClick={(e) => {
        e.stopPropagation()
        onPick()
      }}
    >
      <div className="relative aspect-[16/9] max-h-[5.5rem] w-full shrink-0 overflow-hidden border-b border-border/40 bg-muted/30">
        <img src={thumbnailSrc} alt="" className="size-full object-cover" loading="lazy" draggable={false} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1 pt-5">
          <span className="line-clamp-2 text-[9px] font-semibold leading-tight text-white">{title}</span>
        </div>
      </div>
      <LibraryPreviewFrame variant="palette" showBadge={false} className="rounded-none border-0 shadow-none">
        <div className="pointer-events-none max-h-[min(32dvh,140px)] overflow-hidden rounded-md bg-white/75 px-0.5 py-0.5 ring-1 ring-slate-200/85">
          <div className="origin-top select-none [zoom:0.72] max-w-none sm:[zoom:0.78]">
            <BlockViews
              block={demo}
              selected={false}
              onSelect={() => {}}
              inlineEdit={false}
              readOnly
            />
          </div>
        </div>
      </LibraryPreviewFrame>
    </button>
  )
}

export function BlockInsertLine({
  zone,
  insertIndex,
  disabled,
  nested,
}: {
  zone: CanvasZone
  insertIndex: number
  disabled?: boolean
  nested?: { rowId: string; column: 0 | 1 }
}) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'kinds' | 'blocks'>('kinds')
  const [activeKind, setActiveKind] = useState<LibraryKindOrAll>('all')
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const reactId = useId().replace(/:/g, '')
  const { addBlock, addBlockNested, project } = useProject()

  const placeZone = nested ? 'body' : zone

  const pickable = useMemo(() => {
    return libraryItemsForSite(project.siteType).filter((it) => {
      if (nested && it.type === 'row-2') return false
      return canPlaceBlock(it.type, placeZone)
    })
  }, [nested, placeZone, project.siteType])

  const kindCounts = useMemo(() => {
    return {
      all: pickable.length,
      section: pickable.filter((i) => i.kind === 'section').length,
      component: pickable.filter((i) => i.kind === 'component').length,
      button: pickable.filter((i) => i.kind === 'button').length,
    }
  }, [pickable])

  const itemsForActiveKind = useMemo(() => {
    if (activeKind === 'all') return pickable
    return libraryItemsForSiteAndKind(project.siteType, activeKind).filter((it) => {
      if (nested && it.type === 'row-2') return false
      return canPlaceBlock(it.type, placeZone)
    })
  }, [activeKind, nested, pickable, placeZone, project.siteType])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return itemsForActiveKind
    return itemsForActiveKind.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.type.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q),
    )
  }, [itemsForActiveKind, query])

  const byCategory = useMemo(() => {
    const m = new Map<LibraryCategory, LibraryItem[]>()
    for (const c of ORDER) m.set(c, [])
    for (const it of filtered) {
      const arr = m.get(it.category) ?? []
      arr.push(it)
      m.set(it.category, arr)
    }
    return m
  }, [filtered])

  const insertDropId = useMemo(
    () =>
      nested
        ? insertDropIdNested(nested.rowId, nested.column, insertIndex)
        : insertDropIdRoot(zone, insertIndex),
    [nested, zone, insertIndex],
  )

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: insertDropId,
    disabled: Boolean(disabled),
    data: {
      kind: 'insert-line' as const,
      zone,
      insertIndex,
      nested,
    },
  })

  const setMergedRef = useCallback(
    (el: HTMLDivElement | null) => {
      rootRef.current = el
      setDropRef(el)
    },
    [setDropRef],
  )

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const el = rootRef.current
      if (el && !el.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (step === 'blocks') {
          setStep('kinds')
          setQuery('')
        } else {
          setOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', onDoc, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, step])

  const closeAll = () => {
    setOpen(false)
    setStep('kinds')
    setActiveKind('all')
    setQuery('')
  }

  if (disabled) {
    return <div ref={setDropRef} className="h-2 shrink-0" aria-hidden />
  }

  const addItem = (it: LibraryItem) => {
    if (nested) {
      addBlockNested('body', nested.rowId, nested.column, it.type, insertIndex, false, it.presetOverrides)
    } else {
      addBlock(zone, it.type, insertIndex, false, it.presetOverrides)
    }
    closeAll()
  }

  const openPicker = () => {
    setStep('kinds')
    setActiveKind('all')
    setQuery('')
    setOpen(true)
  }

  const kindTitle =
    activeKind === 'all'
      ? 'Tüm bloklar'
      : activeKind === 'section'
        ? 'Bölümler'
        : activeKind === 'component'
          ? 'Bileşenler'
          : 'Aksiyonlar'

  return (
    <div
      ref={setMergedRef}
      data-insert-picker=""
      className={cn(
        'group/ins relative z-10 flex min-h-[2.75rem] shrink-0 touch-manipulation items-center justify-center py-0.5',
        open && 'z-[45]',
        isOver && 'rounded-md ring-2 ring-primary/35 ring-offset-1 ring-offset-background',
      )}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-border/0 transition-colors',
          'group-hover/ins:bg-primary/30',
          open && 'bg-primary/40',
        )}
      />
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className={cn(
          'relative z-10 h-8 w-8 rounded-full border border-primary/20 bg-background/95 p-0 text-primary shadow-sm backdrop-blur-sm transition-all',
          'pointer-events-auto scale-95 opacity-[0.42]',
          'group-hover/ins:scale-100 group-hover/ins:opacity-100',
          open && 'scale-100 opacity-100 ring-2 ring-primary/25',
        )}
        aria-label="Buraya blok ekle"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          if (open) closeAll()
          else openPicker()
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
      {open ? (
        <div
          className="absolute left-1/2 top-full z-50 mt-2 w-[min(96vw,28rem)] max-h-[min(72vh,34rem)] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {step === 'kinds' ? (
            <>
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-2.5">
                <p className="text-xs font-semibold text-foreground">Bileşen galerisi</p>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 shrink-0" aria-label="Kapat" onClick={closeAll}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3">
                <p className="mb-3 text-center text-[11px] text-muted-foreground">Tür seçin; ardından bloğu seçin.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {KIND_META.map(({ kind, label, hint, Icon }) => {
                    const n = kindCounts[kind]
                    const disabledKind = n === 0
                    return (
                      <button
                        key={kind}
                        type="button"
                        disabled={disabledKind}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (disabledKind) return
                          setActiveKind(kind)
                          setStep('blocks')
                          setQuery('')
                        }}
                        className={cn(
                          'flex flex-col items-center gap-1.5 rounded-xl border border-border/70 bg-card p-3 text-center transition-all',
                          'hover:border-primary/40 hover:bg-primary/[0.06] hover:shadow-md',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                          disabledKind && 'cursor-not-allowed opacity-40 hover:border-border/70 hover:bg-card hover:shadow-none',
                        )}
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/80 text-primary ring-1 ring-border/50">
                          <Icon className="h-6 w-6" strokeWidth={1.75} />
                        </span>
                        <span className="text-[11px] font-semibold leading-tight">{label}</span>
                        <span className="text-[9px] leading-tight text-muted-foreground">{hint}</span>
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-muted-foreground">
                          {n}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-muted/30 px-2 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 shrink-0 gap-0.5 px-2 text-xs"
                  onClick={() => {
                    setStep('kinds')
                    setQuery('')
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Geri
                </Button>
                <span className="hidden min-w-0 flex-1 truncate text-center text-[11px] font-semibold text-foreground sm:block">
                  {kindTitle}
                </span>
                <div className="flex min-w-0 flex-1 basis-[8rem] items-center gap-1.5 sm:max-w-[12rem] sm:flex-none">
                  <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ara…"
                    className="h-8 min-w-0 flex-1 border-0 bg-transparent text-xs shadow-none focus-visible:ring-0"
                  />
                </div>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 shrink-0" aria-label="Kapat" onClick={closeAll}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="border-b border-border/40 px-3 py-1.5 text-center text-[10px] text-muted-foreground sm:hidden">
                {kindTitle}
              </p>
              <ScrollArea className="max-h-[min(58vh,28rem)]">
                <div className="space-y-4 p-3">
                  {filtered.length === 0 ? (
                    <p className="py-8 text-center text-xs text-muted-foreground">Bu türde uygun blok yok.</p>
                  ) : (
                    ORDER.map((cat) => {
                      const items = byCategory.get(cat) ?? []
                      if (!items.length) return null
                      return (
                        <div key={cat}>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{cat}</p>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {items.map((it) => {
                              const demo: BlockInstance = withLibraryThumbnailChildren(
                                {
                                  id: `ins-${reactId}-${libraryItemKey(it)}`,
                                  type: it.type,
                                  props: mergeBlockProps(it.type, project.siteType, it.presetOverrides),
                                },
                                `${reactId}-${libraryItemKey(it)}`,
                              )
                              return (
                                <InsertPreviewCard
                                  key={libraryItemKey(it)}
                                  demo={demo}
                                  title={it.title}
                                  thumbnailSrc={resolveLibraryThumbnail(it)}
                                  onPick={() => addItem(it)}
                                />
                              )
                            })}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
