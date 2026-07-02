import { getRowColumns } from '@/lib/block-tree'
import { displayTitleForBlockType } from '@/lib/templates'
import type { BlockInstance, CanvasZone, Project } from '@/types/project'

function blocksOf(project: Project, z: CanvasZone): BlockInstance[] {
  if (z === 'header') return project.headerBlocks
  if (z === 'footer') return project.footerBlocks
  return project.bodyBlocks
}

function findPathInBody(
  blocks: BlockInstance[],
  targetId: string,
  trail: BlockInstance[],
): BlockInstance[] | null {
  for (const b of blocks) {
    if (b.id === targetId) return [...trail, b]
    if (b.type === 'row-2') {
      const [c0, c1] = getRowColumns(b)
      const p0 = findPathInBody(c0, targetId, [...trail, b])
      if (p0) return p0
      const p1 = findPathInBody(c1, targetId, [...trail, b])
      if (p1) return p1
    }
  }
  return null
}

export function selectionBreadcrumb(
  project: Project,
  selection: { zone: CanvasZone; id: string },
): { id: string; label: string }[] {
  const zoneLabel =
    selection.zone === 'header' ? 'Üst' : selection.zone === 'footer' ? 'Alt' : 'Gövde'
  const list = blocksOf(project, selection.zone)
  const path =
    selection.zone === 'body'
      ? findPathInBody(list, selection.id, [])
      : list.filter((b) => b.id === selection.id)

  if (!path?.length) {
    return [{ id: 'root', label: zoneLabel }]
  }

  const crumbs = [{ id: 'root', label: zoneLabel }]
  for (const b of path) {
    crumbs.push({
      id: b.id,
      label:
        b.type === 'row-2'
          ? '2 sütun'
          : displayTitleForBlockType(b.type).slice(0, 28),
    })
  }
  return crumbs
}
