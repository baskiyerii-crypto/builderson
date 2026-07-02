import { useDraggable } from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Search, Sparkles } from 'lucide-react'
import { BlockViews } from '@/blocks/BlockViews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { getRowColumns } from '@/lib/block-tree'
import { LibraryPreviewFrame } from '@/components/builder/LibraryPreviewFrame'
import { withLibraryThumbnailChildren } from '@/lib/library-thumbnail-demo'
import { resolveLibraryThumbnail } from '@/lib/library-thumbnails'
import {
  ORDER,
  allowedZonesForBlock,
  displayTitleForBlockType,
  libraryItemKey,
  libraryItemsForSite,
  libraryItemsForSiteAndKind,
  mergeBlockProps,
  type LibraryCategory,
  type LibraryItem,
  type LibraryKind,
} from '@/lib/templates'
import type { Selection } from '@/context/ProjectContext'
import type { BlockInstance, CanvasZone } from '@/types/project'
import { useProject } from '@/context/ProjectContext'

function PaletteDraggable({
  item,
  disabled,
  siteType,
  onAddAndEdit,
}: {
  item: LibraryItem
  disabled?: boolean
  siteType: ReturnType<typeof useProject>['project']['siteType']
  onAddAndEdit?: (item: LibraryItem) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${item.catalogId}`,
    disabled,
    data: {
      source: 'palette',
      blockType: item.type,
      presetOverrides: item.presetOverrides,
      title: item.title,
      catalogId: item.catalogId,
    },
  })

  const demo: BlockInstance = useMemo(() => {
    const base: BlockInstance = {
      id: `demo-${item.catalogId}`,
      type: item.type,
      props: mergeBlockProps(item.type, siteType, item.presetOverrides),
    }
    return withLibraryThumbnailChildren(base, item.catalogId)
  }, [item.catalogId, item.type, item.presetOverrides, siteType])

  const thumbSrc = useMemo(() => resolveLibraryThumbnail(item), [item])

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'group/card relative z-[70] cursor-grab overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all active:cursor-grabbing',
        'hover:border-primary/35 hover:shadow-md',
        disabled && 'pointer-events-none opacity-50',
        isDragging && 'z-[100] scale-[0.98] opacity-95 ring-2 ring-primary shadow-lg',
      )}
    >
      <div className="relative aspect-[18/10] max-h-[7.25rem] w-full overflow-hidden border-b border-border/40 bg-muted/30">
        <img
          src={thumbSrc}
          alt=""
          className="size-full object-cover"
          loading="lazy"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-2.5 pb-1.5 pt-6">
          <span className="line-clamp-2 text-[10px] font-semibold leading-tight text-white drop-shadow-sm">
            {item.title}
          </span>
        </div>
        <Sparkles className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-white/80 opacity-0 transition-opacity group-hover/card:opacity-100" />
      </div>
      <LibraryPreviewFrame
        variant="palette"
        showBadge={false}
        className="rounded-none border-0 shadow-none"
      >
        <div className="pointer-events-none max-h-[min(52dvh,240px)] overflow-hidden rounded-md bg-white/75 px-0.5 py-0.5 ring-1 ring-slate-200/85">
          <div className="pointer-events-auto origin-top select-none [zoom:0.88] max-w-none motion-reduce:[zoom:1] group-hover/card:[zoom:0.92]">
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
      <div className="flex flex-col gap-1 border-t border-border/40 bg-muted/20 px-2 py-1.5">
        <p className="text-[9px] text-muted-foreground">Sürükleyip sayfada istediğiniz çizgiye bırakın</p>
        {onAddAndEdit && !disabled ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-7 text-[10px]"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onAddAndEdit(item)
            }}
          >
            Ekle ve düzenle
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function CategorySection({
  cat,
  items,
  disabled,
  siteType,
  onAddAndEdit,
}: {
  cat: LibraryCategory
  items: LibraryItem[]
  disabled?: boolean
  siteType: ReturnType<typeof useProject>['project']['siteType']
  onAddAndEdit?: (item: LibraryItem) => void
}) {
  const [open, setOpen] = useState(true)
  if (!items.length) return null
  return (
    <div className="border-b border-sidebar-border/50 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        {cat}
        <span className="ml-auto rounded-md bg-sidebar-accent/80 px-1.5 py-0.5 text-[10px] font-normal tabular-nums text-muted-foreground">
          {items.length}
        </span>
      </button>
      {open ? (
        <div className="grid gap-2.5 px-3 pb-4">
          {items.map((it) => (
            <PaletteDraggable
              key={libraryItemKey(it)}
              item={it}
              disabled={disabled}
              siteType={siteType}
              onAddAndEdit={onAddAndEdit}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function LayerPickButton({
  zone,
  depth,
  label,
  selected,
  disabled,
  onPick,
}: {
  zone: CanvasZone
  depth: number
  label: string
  selected: boolean
  disabled?: boolean
  onPick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'flex w-full max-w-full items-baseline gap-2 rounded-md border border-transparent py-1.5 pl-2 text-left text-xs transition-colors',
        selected
          ? 'border-primary/30 bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/60',
        disabled && 'pointer-events-none opacity-50',
      )}
      style={{ paddingLeft: `${10 + depth * 10}px` }}
      onClick={onPick}
    >
      <span className="min-w-0 flex-1 truncate font-medium">{label}</span>
      <span className="shrink-0 text-[10px] capitalize text-muted-foreground">{zone}</span>
    </button>
  )
}

function BlockLayers({
  block,
  zone,
  depth,
  selection,
  setSelection,
  disabled,
}: {
  block: BlockInstance
  zone: CanvasZone
  depth: number
  selection: Selection
  setSelection: (s: Selection) => void
  disabled?: boolean
}) {
  const selected = Boolean(selection && selection.zone === zone && selection.id === block.id)
  const label = displayTitleForBlockType(block.type)

  if (block.type !== 'row-2') {
    return (
      <LayerPickButton
        zone={zone}
        depth={depth}
        label={label}
        selected={selected}
        disabled={disabled}
        onPick={() => setSelection({ zone, id: block.id })}
      />
    )
  }

  const [c0, c1] = getRowColumns(block)

  return (
    <div className="space-y-0.5">
      <LayerPickButton
        zone={zone}
        depth={depth}
        label={label}
        selected={selected}
        disabled={disabled}
        onPick={() => setSelection({ zone, id: block.id })}
      />
      <div className="ml-2 space-y-2 border-l border-sidebar-border/35 pl-2">
        <div>
          <p className="py-0.5 pl-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Sütun 1
          </p>
          <div className="space-y-0.5">
            {c0.map((b) => (
              <BlockLayers
                key={b.id}
                block={b}
                zone="body"
                depth={depth + 1}
                selection={selection}
                setSelection={setSelection}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="py-0.5 pl-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Sütun 2
          </p>
          <div className="space-y-0.5">
            {c1.map((b) => (
              <BlockLayers
                key={b.id}
                block={b}
                zone="body"
                depth={depth + 1}
                selection={selection}
                setSelection={setSelection}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function BlockLayersTreePanel({ disabled }: { disabled: boolean }) {
  const { project, selection, setSelection, addBlock } = useProject()

  const ZoneBlock = ({
    title,
    zone,
    list,
  }: {
    title: string
    zone: CanvasZone
    list: BlockInstance[]
  }) => (
    <div className="mb-4 last:mb-0">
      <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <div className="space-y-0.5 rounded-lg border border-sidebar-border/40 bg-muted/20 p-1.5">
        {list.length === 0 ? (
          <p className="px-2 py-3 text-center text-[11px] text-muted-foreground">Boş</p>
        ) : (
          list.map((b) => (
            <BlockLayers
              key={b.id}
              block={b}
              zone={zone}
              depth={0}
              selection={selection}
              setSelection={setSelection}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <ScrollArea className="min-h-0 flex-1">
        <div className="pr-2 pb-4 pt-1">
          <p className="mb-3 px-1 text-xs leading-relaxed text-muted-foreground">
            Öğeye tıklayarak seçin. İç sütunlar iç içe listelenir; sürükleyerek gövde, satır veya sütunlar arasında
            taşıyabilirsiniz.
          </p>
          <ZoneBlock title="Üst alan" zone="header" list={project.headerBlocks} />
          <ZoneBlock title="Sayfa gövdesi" zone="body" list={project.bodyBlocks} />
          <ZoneBlock title="Alt alan" zone="footer" list={project.footerBlocks} />
        </div>
      </ScrollArea>
      <Button
        size="sm"
        variant="outline"
        className="mx-2 mb-2 mt-1 shrink-0 border-sidebar-border"
        onClick={() => addBlock('body', 'text', undefined, true)}
        disabled={disabled}
      >
        Gövdeye metin ekle
      </Button>
    </div>
  )
}

/** Sol dock “Butonlar” sekmesi — yalnızca aksiyon / form blokları, tam önizleme */
export function ButtonKindPalette({ disabled }: { disabled: boolean }) {
  const { project, addBlock } = useProject()
  const items = libraryItemsForSiteAndKind(project.siteType, 'button')
  const addOne = (libItem: LibraryItem) => {
    const zones = allowedZonesForBlock(libItem.type)
    const zone = zones.includes('body') ? 'body' : zones[0]
    addBlock(zone, libItem.type, undefined, true, libItem.presetOverrides)
  }
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-2.5 p-3 pb-6">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          CTA ve bülten blokları. Kartı sürükleyip canvas’ta istediğiniz + çizgisine veya blokların arasına
          bırakın; hızlı eklemek için &quot;Ekle ve düzenle&quot; kullanın.
        </p>
        {items.map((it) => (
          <PaletteDraggable
            key={libraryItemKey(it)}
            item={it}
            disabled={disabled}
            siteType={project.siteType}
            onAddAndEdit={addOne}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

type LibraryKindOrAll = LibraryKind | 'all'

export function LibraryInsertPanel({ disabled }: { disabled: boolean }) {
  const { project, addBlock } = useProject()
  const [kind, setKind] = useState<LibraryKindOrAll>('all')
  const [search, setSearch] = useState('')
  const items =
    kind === 'all'
      ? libraryItemsForSite(project.siteType)
      : libraryItemsForSiteAndKind(project.siteType, kind)

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        displayTitleForBlockType(i.type).toLowerCase().includes(q) ||
        i.catalogId.toLowerCase().includes(q),
    )
  }, [items, search])

  const addAndSelect = (libItem: LibraryItem) => {
    const zones = allowedZonesForBlock(libItem.type)
    const zone = zones.includes('body') ? 'body' : zones[0]
    addBlock(zone, libItem.type, undefined, true, libItem.presetOverrides)
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden text-foreground">
      <div className="shrink-0 border-b border-[#e8eaed] px-3 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Kütüphane
        </p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {project.siteType === 'ecommerce'
            ? 'E-ticaret odaklı bileşenler.'
            : project.siteType === 'corporate'
              ? 'Kurumsal vitrin ve içerik.'
              : 'Önce site tipi seçin.'}
        </p>
      </div>
      <div className="relative mx-2 mt-2 shrink-0">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Blok ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 border-[#c9ced6] bg-[#f7f8fa] pl-8 text-xs"
        />
      </div>
      <div className="mx-2 mt-2 flex shrink-0 flex-wrap gap-1 rounded-lg border border-[#e8eaed] bg-[#f7f8fa] p-1">
        {(
          [
            { k: 'all' as const, label: 'Tümü' },
            { k: 'section' as const, label: 'Bölüm' },
            { k: 'component' as const, label: 'Bileşen' },
            { k: 'button' as const, label: 'Aksiyon' },
          ] as const
        ).map(({ k, label }) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={cn(
              'flex-1 rounded-md px-2 py-1.5 text-center text-[11px] font-medium transition-colors',
              kind === k
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="pb-6 pt-1">
          {disabled ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              Son yönetici: yalnızca metin düzenleme. Yeni blok eklenemez.
            </p>
          ) : null}
          {ORDER.map((cat) => (
            <CategorySection
              key={cat}
              cat={cat}
              items={filteredItems.filter((i) => i.category === cat)}
              disabled={disabled}
              siteType={project.siteType}
              onAddAndEdit={disabled ? undefined : addAndSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

/** @deprecated Yerine sol rail + {@link LibraryInsertPanel} / {@link BlockLayersTreePanel} kullanın */
export function BlockLibrary() {
  const { project } = useProject()
  const disabled = project.role === 'client'

  return (
    <div className="flex h-full min-h-0 flex-col border-l border-sidebar-border/60 bg-sidebar text-sidebar-foreground">
      <Tabs defaultValue="insert" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="mx-2 mt-2 grid shrink-0 grid-cols-2 gap-1 rounded-lg bg-muted/50 p-1">
          <TabsTrigger
            value="insert"
            className="rounded-md text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Ekle
          </TabsTrigger>
          <TabsTrigger
            value="layers"
            className="rounded-md text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Katmanlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insert" className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden">
          <LibraryInsertPanel disabled={disabled} />
        </TabsContent>

        <TabsContent
          value="layers"
          className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden px-2 pb-2 pt-2"
        >
          <BlockLayersTreePanel disabled={disabled} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
