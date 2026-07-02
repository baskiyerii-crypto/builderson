import { Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { findBlockDeep } from '@/lib/block-tree'
import { useProject } from '@/context/ProjectContext'
import type { CanvasZone } from '@/types/project'

function blocksFor(
  project: ReturnType<typeof useProject>['project'],
  z: CanvasZone,
) {
  if (z === 'header') return project.headerBlocks
  if (z === 'footer') return project.footerBlocks
  return project.bodyBlocks
}

export function CanvasQuickToolbar() {
  const { project, selection, removeBlock, setSelection, duplicateBlock } = useProject()
  if (project.previewChrome || !selection) return null
  const list = blocksFor(project, selection.zone)
  const block = findBlockDeep(list, selection.id)
  if (!block) return null
  const isTopLevel = list.some((b) => b.id === selection.id)

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-[#c9ced6] bg-white px-3 py-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Seçili
      </span>
      <div className="flex flex-1 items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 border-[#c9ced6] bg-white text-xs text-slate-700 hover:bg-slate-50"
          disabled={!isTopLevel}
          title={!isTopLevel ? 'İç içe blokta kopya yakında' : undefined}
          onClick={() => duplicateBlock(selection.zone, selection.id)}
        >
          <Copy className="mr-1 size-3.5" />
          Kopya
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          className="h-7 text-xs"
          onClick={() => {
            removeBlock(selection.zone, block.id)
            setSelection(null)
          }}
        >
          <Trash2 className="mr-1 size-3.5" />
          Sil
        </Button>
      </div>
    </div>
  )
}
