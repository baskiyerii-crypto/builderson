import type { LibraryItem } from '@/lib/templates'
import { mergeBlockProps } from '@/lib/templates'
import type { SiteType } from '@/types/project'

/** AI / sektör evrimi için girdi — blok props yollarına yayılır */
export type SectorEvolveInput = {
  title?: string
  description?: string
  image_url?: string
}

/** Yalnızca düz alan veya iç içe nesne yolları (dizi indeksi yok) */
function setDeep(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.').filter(Boolean)
  if (!parts.length) return
  let cur: Record<string, unknown> = target
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i]
    const next = cur[k]
    if (!next || typeof next !== 'object' || Array.isArray(next)) cur[k] = {}
    cur = cur[k] as Record<string, unknown>
  }
  cur[parts[parts.length - 1]] = value as never
}

/**
 * `LibraryItem.aiBindings` ile sektör metinlerini preset üzerine uygular.
 * Örn: { title: 'title', description: 'subtitle', image_url: 'imageUrl' }
 */
export function evolvePresetFromSector(
  item: LibraryItem,
  siteType: SiteType | null | undefined,
  sector: SectorEvolveInput,
): Record<string, unknown> {
  const base = mergeBlockProps(item.type, siteType, item.presetOverrides)
  const bindings = item.aiBindings
  if (!bindings) return base
  const next = { ...base } as Record<string, unknown>
  for (const [slot, propPath] of Object.entries(bindings)) {
    const v = sector[slot as keyof SectorEvolveInput]
    if (v === undefined || v === '') continue
    if (!propPath.includes('.')) next[propPath] = v
    else setDeep(next, propPath, v)
  }
  return next
}

export function libraryItemsWithSectorPresets(
  items: LibraryItem[],
  siteType: SiteType | null | undefined,
  sector: SectorEvolveInput,
): LibraryItem[] {
  return items.map((it) => {
    if (!it.aiBindings) return it
    return {
      ...it,
      presetOverrides: evolvePresetFromSector(it, siteType, sector),
    }
  })
}
