import type { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { BlockViews } from '@/blocks/BlockViews'
import { RowTwoEditor } from '@/components/builder/RowTwoEditor'
import { blockLayoutSurfaceProps } from '@/lib/block-layout-styles'
import type { BlockInstance, CanvasZone } from '@/types/project'
import { useProject } from '@/context/ProjectContext'
import { cn } from '@/lib/utils'

export function SortableBlock({
  block,
  zone,
  selected,
  onSelect,
  inlineEdit,
  readOnly,
  onTextCommit,
  dragDisabled,
  nestedContext,
}: {
  block: BlockInstance
  zone: CanvasZone
  selected: boolean
  onSelect: () => void
  inlineEdit: boolean
  readOnly?: boolean
  onTextCommit?: (next: string) => void
  dragDisabled?: boolean
  nestedContext?: { rowId: string; column: 0 | 1 }
}) {
  const { removeBlock } = useProject()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: nestedContext
      ? {
          zone,
          kind: 'nested' as const,
          rowId: nestedContext.rowId,
          column: nestedContext.column,
        }
      : { zone, kind: 'block' as const },
    disabled: dragDisabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const layoutSurf = blockLayoutSurfaceProps(block.layout)

  const shell = (inner: ReactNode) => (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg border border-transparent p-1',
        isDragging && 'z-10 opacity-80 shadow-lg',
        selected && 'border-[#3899ec]/45 bg-[#3899ec]/[0.08] ring-1 ring-[#3899ec]/20',
      )}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {!readOnly && !dragDisabled ? (
        <button
          type="button"
          className="absolute -left-1 top-2 z-20 flex h-8 w-6 cursor-grab items-center justify-center rounded border bg-background text-muted-foreground opacity-0 transition group-hover:opacity-100 active:cursor-grabbing"
          aria-label="Taşı"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      ) : null}
      {!readOnly && !dragDisabled ? (
        <button
          type="button"
          className="absolute -right-1 top-2 z-20 flex h-8 w-8 items-center justify-center rounded border border-destructive/25 bg-background text-destructive/80 opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          aria-label="Bloğu sil"
          onClick={(e) => {
            e.stopPropagation()
            removeBlock(zone, block.id)
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ) : null}
      {inner}
    </div>
  )

  if (block.type === 'row-2' && !nestedContext) {
    return shell(<RowTwoEditor row={block} />)
  }

  return shell(
    <div className={layoutSurf.className} style={layoutSurf.style}>
      <BlockViews
        block={block}
        selected={selected}
        onSelect={onSelect}
        inlineEdit={inlineEdit}
        readOnly={readOnly}
        onTextCommit={onTextCommit}
      />
    </div>,
  )
}
