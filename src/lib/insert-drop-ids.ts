import type { CanvasZone } from '@/types/project'

const P = 'insline'

/** Kök liste: `insline~body~3` → body’de 3. indekse ekle */
export function insertDropIdRoot(zone: CanvasZone, insertIndex: number): string {
  return `${P}~${zone}~${insertIndex}`
}

/** Satır içi: `insline~n~{rowId}~0~2` */
export function insertDropIdNested(rowId: string, column: 0 | 1, insertIndex: number): string {
  return `${P}~n~${rowId}~${column}~${insertIndex}`
}

export type ParsedInsertDrop =
  | { mode: 'root'; zone: CanvasZone; insertIndex: number }
  | { mode: 'nested'; rowId: string; column: 0 | 1; insertIndex: number }

export function parseInsertDropId(overId: string): ParsedInsertDrop | null {
  if (!overId.startsWith(`${P}~`)) return null
  const parts = overId.split('~')
  if (parts[0] !== P) return null
  if (parts[1] === 'n' && parts.length === 5) {
    const rowId = parts[2]
    const column = Number(parts[3]) as 0 | 1
    const insertIndex = Number(parts[4])
    if (column !== 0 && column !== 1) return null
    if (!Number.isFinite(insertIndex) || insertIndex < 0) return null
    return { mode: 'nested', rowId, column, insertIndex }
  }
  if (parts.length === 3) {
    const zone = parts[1] as CanvasZone
    if (zone !== 'header' && zone !== 'body' && zone !== 'footer') return null
    const insertIndex = Number(parts[2])
    if (!Number.isFinite(insertIndex) || insertIndex < 0) return null
    return { mode: 'root', zone, insertIndex }
  }
  return null
}
