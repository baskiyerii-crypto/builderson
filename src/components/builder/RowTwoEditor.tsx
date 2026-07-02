import { Fragment, type ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import { getRowColumns } from '@/lib/block-tree'
import { blockLayoutSurfaceProps } from '@/lib/block-layout-styles'
import { useProject } from '@/context/ProjectContext'
import type { BlockInstance } from '@/types/project'
import { BlockInsertLine } from '@/components/builder/BlockInsertLine'
import { SortableBlock } from '@/components/builder/SortableBlock'

function ColDrop({
  rowId,
  column,
  children,
}: {
  rowId: string
  column: 0 | 1
  children: ReactNode
}) {
  const id = `drop-row-${rowId}-col-${column}`
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { zone: 'body' as const, kind: 'row-slot', rowId, column },
  })
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[5.5rem] flex-1 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/25 p-2.5 transition-colors',
        isOver && 'border-primary/50 bg-primary/8 ring-1 ring-primary/15',
      )}
    >
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Sütun {column + 1}
      </p>
      {children}
    </div>
  )
}

export function RowTwoEditor({ row }: { row: BlockInstance }) {
  const { project, selection, setSelection, updateBlockProps } = useProject()
  const chrome = !project.previewChrome
  const [c0, c1] = getRowColumns(row)
  const ids0 = c0.map((b) => b.id)
  const ids1 = c1.map((b) => b.id)

  const insertDisabled = !chrome || project.role === 'client'

  const renderCol = (column: 0 | 1, list: BlockInstance[]) => {
    const ids = column === 0 ? ids0 : ids1
    return (
      <ColDrop rowId={row.id} column={column}>
        <SortableContext
          id={`nested-${row.id}-col-${column}`}
          items={ids}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-0.5">
            <BlockInsertLine
              zone="body"
              insertIndex={0}
              disabled={insertDisabled}
              nested={{ rowId: row.id, column }}
            />
            {list.map((b, i) => (
              <Fragment key={b.id}>
                <SortableBlock
                  block={b}
                  zone="body"
                  nestedContext={{ rowId: row.id, column }}
                  selected={selection?.zone === 'body' && selection?.id === b.id}
                  onSelect={() => setSelection({ zone: 'body', id: b.id })}
                  inlineEdit={
                    chrome &&
                    (b.type === 'text' || b.type === 'heading') &&
                    selection?.id === b.id
                  }
                  readOnly={!chrome}
                  dragDisabled={!chrome || project.role === 'client'}
                  onTextCommit={(next) => {
                    updateBlockProps('body', b.id, { text: next })
                  }}
                />
                <BlockInsertLine
                  zone="body"
                  insertIndex={i + 1}
                  disabled={insertDisabled}
                  nested={{ rowId: row.id, column }}
                />
              </Fragment>
            ))}
          </div>
        </SortableContext>
      </ColDrop>
    )
  }

  const rowSelected = selection?.zone === 'body' && selection?.id === row.id
  const layoutSurf = blockLayoutSurfaceProps(row.layout)

  return (
    <div
      className={cn(
        'relative rounded-xl border-2 border-dashed border-slate-300/80 bg-slate-50/80 p-2',
        layoutSurf.className,
        rowSelected && 'border-[#3899ec]/50 ring-2 ring-[#3899ec]/20',
      )}
      style={layoutSurf.style}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        setSelection({ zone: 'body', id: row.id })
      }}
    >
      {rowSelected && chrome ? (
        <span className="absolute left-3 top-2 z-10 rounded bg-[#3899ec] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Satır (2 sütun)
        </span>
      ) : null}
      <div className="mt-6 grid gap-2 md:grid-cols-2">
        {renderCol(0, c0)}
        {renderCol(1, c1)}
      </div>
    </div>
  )
}
