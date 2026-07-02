import {
  DndContext,
  DragOverlay,
  type CollisionDetection,
  type DragEndEvent,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Fragment, useState, type ReactNode } from 'react'
import { BlockViews } from '@/blocks/BlockViews'
import { LibraryPreviewFrame } from '@/components/builder/LibraryPreviewFrame'
import { findNestedSlot, getRowColumns } from '@/lib/block-tree'
import { deviceLabel } from '@/lib/device-frame'
import { withLibraryThumbnailChildren } from '@/lib/library-thumbnail-demo'
import { parseInsertDropId } from '@/lib/insert-drop-ids'
import { canPlaceBlock, displayTitleForBlockType, mergeBlockProps } from '@/lib/templates'
import { cn } from '@/lib/utils'
import { useProject } from '@/context/ProjectContext'
import type { BlockInstance, BlockType, CanvasZone, Project } from '@/types/project'
import { BlockInsertLine } from '@/components/builder/BlockInsertLine'
import { SortableBlock } from '@/components/builder/SortableBlock'

function blocksFor(project: Project, z: CanvasZone) {
  if (z === 'header') return project.headerBlocks
  if (z === 'footer') return project.footerBlocks
  return project.bodyBlocks
}

function DropShell({
  zone,
  children,
}: {
  zone: CanvasZone
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${zone}`,
    data: { zone },
  })
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[4.5rem] rounded-xl border border-dashed border-transparent p-2 transition-colors',
        isOver && 'border-primary/45 bg-primary/8 ring-1 ring-primary/15',
      )}
    >
      {children}
    </div>
  )
}

export function BuilderCanvasPanel() {
  const { project, selection, setSelection, updateBlockProps } = useProject()
  const chrome = !project.previewChrome

  const renderZone = (zone: CanvasZone) => {
    const list = blocksFor(project, zone)
    const ids = list.map((b) => b.id)
    const inlineFor = (b: (typeof list)[0]) => {
      if (!chrome) return false
      if (b.type === 'text' || b.type === 'heading') return selection?.id === b.id
      return false
    }
    const insertDisabled = !chrome || project.role === 'client'

    return (
      <DropShell zone={zone}>
        <SortableContext id={`list-${zone}`} items={ids} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-0.5">
            <BlockInsertLine zone={zone} insertIndex={0} disabled={insertDisabled} />
            {list.map((b, i) => (
              <Fragment key={b.id}>
                <SortableBlock
                  block={b}
                  zone={zone}
                  selected={selection?.zone === zone && selection?.id === b.id}
                  onSelect={() => setSelection({ zone, id: b.id })}
                  inlineEdit={inlineFor(b)}
                  readOnly={!chrome}
                  dragDisabled={!chrome || project.role === 'client'}
                  onTextCommit={(next) => {
                    updateBlockProps(zone, b.id, { text: next })
                  }}
                />
                <BlockInsertLine zone={zone} insertIndex={i + 1} disabled={insertDisabled} />
              </Fragment>
            ))}
          </div>
        </SortableContext>
      </DropShell>
    )
  }

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#dfe3e8]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:radial-gradient(circle_at_1px_1px,_rgb(148_163_184/0.25)_1px,_transparent_0)] [background-size:18px_18px]" />
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
          <div className="sticky top-0 z-10 flex shrink-0 items-center justify-center border-b border-border/60 bg-muted/30 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {deviceLabel(project.device)}
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-3 md:p-5">
            {renderZone('header')}
            <div className="min-h-[min(40vh,220px)] flex-1 rounded-xl border border-dashed border-muted-foreground/20 bg-muted/25 p-3 shadow-inner md:min-h-[180px]">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Sayfa gövdesi
              </p>
              <p className="mb-3 text-[10px] leading-snug text-muted-foreground/90">
                Blokları sürükleyip sırayla dizin; 2 sütun satırında sütunlar arası taşıyın. Görsel ve metin
                bloklarını istediğiniz sıraya koyarak sayfa akışını kurun.
              </p>
              {renderZone('body')}
            </div>
            {renderZone('footer')}
          </div>
        </div>
      </div>
    </div>
  )
}

type DndData = {
  source?: string
  blockType?: BlockType
  presetOverrides?: Record<string, unknown>
  title?: string
  catalogId?: string
  zone?: CanvasZone
  kind?: 'block' | 'nested' | string
  rowId?: string
  column?: 0 | 1
}

/** Büyük `drop-*` / kendi sütun kabı, sıralama sırasında `over` olarak seçilip taşımayı engelliyordu */
const builderCollisionDetection: CollisionDetection = (args) => {
  const d = args.active.data.current as DndData | undefined
  if (d?.source === 'palette') return closestCorners(args)

  let containers = args.droppableContainers

  if (d?.kind === 'block' && d.zone) {
    containers = containers.filter((c) => String(c.id) !== `drop-${d.zone}`)
  }

  if (d?.kind === 'nested' && d.rowId !== undefined && d.column !== undefined) {
    const ownCol = `drop-row-${d.rowId}-col-${d.column}`
    containers = containers.filter((c) => {
      const id = String(c.id)
      if (id === 'drop-header' || id === 'drop-body' || id === 'drop-footer') return false
      if (id === ownCol) return false
      return true
    })
  }

  return closestCorners({ ...args, droppableContainers: containers })
}

export function BuilderDndRoot({ children }: { children: ReactNode }) {
  const {
    project,
    addBlock,
    addBlockNested,
    moveBlock,
    moveBlockNested,
    moveBlockNestedCross,
    moveRootIntoNested,
    moveNestedToRoot,
    moveNestedToOtherRow,
  } = useProject()
  const [paletteOverlay, setPaletteOverlay] = useState<{
    blockType: BlockType
    presetOverrides?: Record<string, unknown>
    title: string
    catalogId?: string
  } | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const onDragEnd = (event: DragEndEvent) => {
    setPaletteOverlay(null)
    const { active, over } = event
    if (!over) return
    const a = active.data.current as DndData | undefined
    const overId = String(over.id)
    const preset = a?.presetOverrides

    if (a?.source === 'palette' && a.blockType) {
      const ins = parseInsertDropId(overId)
      if (ins?.mode === 'root' && canPlaceBlock(a.blockType, ins.zone)) {
        addBlock(ins.zone, a.blockType, ins.insertIndex, undefined, preset)
        return
      }
      if (ins?.mode === 'nested' && canPlaceBlock(a.blockType, 'body')) {
        addBlockNested('body', ins.rowId, ins.column, a.blockType, ins.insertIndex, undefined, preset)
        return
      }
      const slot = /^drop-row-(.+)-col-([01])$/.exec(overId)
      if (slot && canPlaceBlock(a.blockType, 'body')) {
        addBlockNested('body', slot[1], Number(slot[2]) as 0 | 1, a.blockType, undefined, undefined, preset)
        return
      }
      if (overId.startsWith('drop-')) {
        const zone = (over.data.current as { zone?: CanvasZone })?.zone
        if (zone && canPlaceBlock(a.blockType, zone)) addBlock(zone, a.blockType, undefined, undefined, preset)
        return
      }
      const nest = findNestedSlot(project.bodyBlocks, overId)
      if (nest && canPlaceBlock(a.blockType, 'body')) {
        addBlockNested('body', nest.rowId, nest.column, a.blockType, nest.atIndex, undefined, preset)
        return
      }
      for (const z of ['header', 'body', 'footer'] as CanvasZone[]) {
        if (!canPlaceBlock(a.blockType, z)) continue
        const list = blocksFor(project, z)
        const idx = list.findIndex((b) => b.id === overId)
        if (idx >= 0) {
          addBlock(z, a.blockType, idx, undefined, preset)
          return
        }
      }
      return
    }

    if (a?.kind === 'nested' && a.rowId !== undefined && a.column !== undefined) {
      const zone = a.zone ?? 'body'
      if (zone !== 'body') return
      const rowId = a.rowId
      const column = a.column
      const activeId = String(active.id)
      if (overId === activeId) return

      const row = project.bodyBlocks.find((b) => b.id === rowId && b.type === 'row-2')
      if (!row) return
      const [c0, c1] = getRowColumns(row)
      const fromArr = column === 0 ? c0 : c1
      const oldIdx = fromArr.findIndex((x) => x.id === activeId)
      if (oldIdx < 0) return

      const slotDrop = /^drop-row-(.+)-col-([01])$/.exec(overId)
      if (slotDrop && slotDrop[1] === rowId) {
        const toCol = Number(slotDrop[2]) as 0 | 1
        if (toCol !== column) {
          const toArr = toCol === 0 ? c0 : c1
          moveBlockNestedCross('body', rowId, column, toCol, oldIdx, toArr.length)
          return
        }
        /* Aynı sütunda sıralama: aşağıdaki insert satırı / blok id’sine düşsün */
      } else if (slotDrop && slotDrop[1] !== rowId) {
        const toRowId = slotDrop[1]
        const toCol = Number(slotDrop[2]) as 0 | 1
        const targetRow = project.bodyBlocks.find((b) => b.id === toRowId && b.type === 'row-2')
        if (!targetRow) return
        const [t0, t1] = getRowColumns(targetRow)
        const toLen = toCol === 0 ? t0.length : t1.length
        moveNestedToOtherRow('body', rowId, column, oldIdx, toRowId, toCol, toLen)
        return
      }

      const rootIns = parseInsertDropId(overId)
      if (rootIns?.mode === 'root' && rootIns.zone === 'body') {
        moveNestedToRoot('body', rowId, column, oldIdx, rootIns.insertIndex)
        return
      }

      if (overId === 'drop-body') {
        moveNestedToRoot('body', rowId, column, oldIdx, undefined)
        return
      }

      const nestedIns = parseInsertDropId(overId)
      if (
        nestedIns?.mode === 'nested' &&
        nestedIns.rowId === rowId &&
        nestedIns.column === column
      ) {
        if (nestedIns.insertIndex >= 0 && oldIdx !== nestedIns.insertIndex) {
          moveBlockNested('body', rowId, column, oldIdx, nestedIns.insertIndex)
        }
        return
      }

      const rootInsert = project.bodyBlocks.findIndex((b) => b.id === overId)
      if (rootInsert >= 0) {
        moveNestedToRoot('body', rowId, column, oldIdx, rootInsert)
        return
      }

      const posOver = findNestedSlot(project.bodyBlocks, overId)
      if (posOver) {
        if (posOver.rowId === rowId) {
          if (posOver.column === column) {
            if (posOver.atIndex >= 0 && oldIdx !== posOver.atIndex) {
              moveBlockNested('body', rowId, column, oldIdx, posOver.atIndex)
            }
          } else {
            moveBlockNestedCross(
              'body',
              rowId,
              column,
              posOver.column,
              oldIdx,
              posOver.atIndex,
            )
          }
        } else {
          moveNestedToOtherRow(
            'body',
            rowId,
            column,
            oldIdx,
            posOver.rowId,
            posOver.column,
            posOver.atIndex,
          )
        }
      }
      return
    }

    if (a?.kind === 'block' && a.zone && active.id !== over.id) {
      const list = blocksFor(project, a.zone)
      const activeId = String(active.id)
      const oldIndex = list.findIndex((b) => b.id === activeId)
      if (oldIndex < 0) return

      const rootGap = parseInsertDropId(overId)
      if (rootGap?.mode === 'root' && rootGap.zone === a.zone) {
        const K = Math.max(0, Math.min(rootGap.insertIndex, list.length))
        const toIndex = oldIndex < K ? K - 1 : K
        if (toIndex >= 0 && toIndex < list.length && oldIndex !== toIndex) {
          moveBlock(a.zone, oldIndex, toIndex)
        }
        return
      }

      if (a.zone === 'body') {
        const slotDrop = /^drop-row-(.+)-col-([01])$/.exec(overId)
        if (slotDrop) {
          const targetRowId = slotDrop[1]
          const toCol = Number(slotDrop[2]) as 0 | 1
          const moved = list[oldIndex]
          if (moved.type !== 'row-2' && moved.id !== targetRowId) {
            moveRootIntoNested('body', oldIndex, targetRowId, toCol, undefined)
          }
          return
        }
        const nest = findNestedSlot(project.bodyBlocks, overId)
        if (nest) {
          const moved = list[oldIndex]
          if (moved.type !== 'row-2' && moved.id !== nest.rowId) {
            moveRootIntoNested('body', oldIndex, nest.rowId, nest.column, nest.atIndex)
          }
          return
        }
      }

      const newIndex = list.findIndex((b) => b.id === overId)
      if (oldIndex >= 0 && newIndex >= 0) moveBlock(a.zone, oldIndex, newIndex)
    }
  }

  const overlayBlock: BlockInstance | null = paletteOverlay
    ? withLibraryThumbnailChildren(
        {
          id: 'palette-overlay',
          type: paletteOverlay.blockType,
          props: mergeBlockProps(
            paletteOverlay.blockType,
            project.siteType,
            paletteOverlay.presetOverrides,
          ),
        },
        paletteOverlay.catalogId ?? paletteOverlay.blockType,
      )
    : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={builderCollisionDetection}
      onDragStart={(e) => {
        const d = e.active.data.current as DndData | undefined
        if (d?.source === 'palette' && d.blockType) {
          setPaletteOverlay({
            blockType: d.blockType,
            presetOverrides: d.presetOverrides,
            title: d.title?.trim() || displayTitleForBlockType(d.blockType),
            catalogId: d.catalogId,
          })
        }
      }}
      onDragEnd={onDragEnd}
      onDragCancel={() => setPaletteOverlay(null)}
    >
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">{children}</div>
      <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        {overlayBlock ? (
          <div className="w-[min(92vw,21rem)] cursor-grabbing overflow-hidden rounded-xl border-2 border-primary/40 bg-background shadow-2xl ring-2 ring-primary/15">
            <p className="truncate border-b border-border/60 bg-muted/40 px-2.5 py-1.5 text-[10px] font-semibold text-foreground">
              {paletteOverlay?.title}
            </p>
            <LibraryPreviewFrame variant="palette" showBadge={false} className="rounded-none border-0 shadow-none">
              <div className="pointer-events-none max-h-[min(50dvh,260px)] overflow-hidden rounded-md bg-white/75 px-0.5 py-0.5 ring-1 ring-slate-200/85">
                <div className="origin-top select-none [zoom:0.88] max-w-none">
                  <BlockViews
                    block={overlayBlock}
                    selected={false}
                    onSelect={() => {}}
                    inlineEdit={false}
                    readOnly
                  />
                </div>
              </div>
            </LibraryPreviewFrame>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
