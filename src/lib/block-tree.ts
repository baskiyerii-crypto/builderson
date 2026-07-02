import { newId } from '@/lib/id'
import type { BlockInstance, BlockLayoutStyle, CanvasZone, Project } from '@/types/project'

export function getRowColumns(block: BlockInstance): [BlockInstance[], BlockInstance[]] {
  if (block.type !== 'row-2') return [[], []]
  const col0 = Array.isArray(block.props.col0) ? (block.props.col0 as BlockInstance[]) : []
  const col1 = Array.isArray(block.props.col1) ? (block.props.col1 as BlockInstance[]) : []
  return [col0, col1]
}

export function setRowColumns(
  block: BlockInstance,
  col0: BlockInstance[],
  col1: BlockInstance[],
): BlockInstance {
  return { ...block, props: { ...block.props, col0, col1 } }
}

export function updateBlockPropsDeep(
  blocks: BlockInstance[],
  id: string,
  props: Record<string, unknown>,
): BlockInstance[] {
  return blocks.map((b) => {
    if (b.id === id) return { ...b, props: { ...b.props, ...props } }
    if (b.type === 'row-2') {
      const [c0, c1] = getRowColumns(b)
      const n0 = updateBlockPropsDeep(c0, id, props)
      const n1 = updateBlockPropsDeep(c1, id, props)
      if (n0 !== c0 || n1 !== c1) return setRowColumns(b, n0, n1)
    }
    return b
  })
}

export function updateBlockLayoutDeep(
  blocks: BlockInstance[],
  id: string,
  layout: Partial<BlockLayoutStyle>,
): BlockInstance[] {
  return blocks.map((b) => {
    if (b.id === id) {
      return { ...b, layout: { ...b.layout, ...layout } }
    }
    if (b.type === 'row-2') {
      const [c0, c1] = getRowColumns(b)
      const n0 = updateBlockLayoutDeep(c0, id, layout)
      const n1 = updateBlockLayoutDeep(c1, id, layout)
      if (n0 !== c0 || n1 !== c1) return setRowColumns(b, n0, n1)
    }
    return b
  })
}

export function removeBlockDeep(blocks: BlockInstance[], id: string): BlockInstance[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) => {
      if (b.type !== 'row-2') return b
      const [c0, c1] = getRowColumns(b)
      const n0 = removeBlockDeep(c0, id)
      const n1 = removeBlockDeep(c1, id)
      if (n0 !== c0 || n1 !== c1) return setRowColumns(b, n0, n1)
      return b
    })
}

export function findBlockDeep(
  blocks: BlockInstance[],
  id: string,
): BlockInstance | undefined {
  for (const b of blocks) {
    if (b.id === id) return b
    if (b.type === 'row-2') {
      const [c0, c1] = getRowColumns(b)
      const f = findBlockDeep(c0, id) ?? findBlockDeep(c1, id)
      if (f) return f
    }
  }
  return undefined
}

export function findBlockWithZone(
  project: Project,
  id: string,
): { block: BlockInstance; zone: CanvasZone } | null {
  for (const zone of ['header', 'body', 'footer'] as CanvasZone[]) {
    const list =
      zone === 'header'
        ? project.headerBlocks
        : zone === 'footer'
          ? project.footerBlocks
          : project.bodyBlocks
    const block = findBlockDeep(list, id)
    if (block) return { block, zone }
  }
  return null
}

export function flattenBlockIds(blocks: BlockInstance[]): string[] {
  const ids: string[] = []
  for (const b of blocks) {
    ids.push(b.id)
    if (b.type === 'row-2') {
      const [c0, c1] = getRowColumns(b)
      ids.push(...flattenBlockIds(c0), ...flattenBlockIds(c1))
    }
  }
  return ids
}

/** Sürüklenen hedef bir satır içi blok id'si ise ekleme konumu */
/** Klonlanan blok ağacına yeni id verir */
export function regenerateIdsDeep(block: BlockInstance): BlockInstance {
  const id = newId()
  if (block.type !== 'row-2') {
    return { ...block, id }
  }
  const [c0, c1] = getRowColumns(block)
  return {
    ...block,
    id,
    props: {
      ...block.props,
      col0: c0.map(regenerateIdsDeep),
      col1: c1.map(regenerateIdsDeep),
    },
  }
}

export function findNestedSlot(
  bodyBlocks: BlockInstance[],
  overBlockId: string,
): { rowId: string; column: 0 | 1; atIndex: number } | null {
  for (const b of bodyBlocks) {
    if (b.type !== 'row-2') continue
    const [c0, c1] = getRowColumns(b)
    const i0 = c0.findIndex((x) => x.id === overBlockId)
    if (i0 >= 0) return { rowId: b.id, column: 0, atIndex: i0 }
    const i1 = c1.findIndex((x) => x.id === overBlockId)
    if (i1 >= 0) return { rowId: b.id, column: 1, atIndex: i1 }
  }
  return null
}

