import type { LibraryItem } from '@/lib/templates'

function hashCatalogId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * `thumbnailUrl` yoksa: kategori + başlıktan deterministik, keskin bir SVG önizleme.
 * Üretimde Playwright ile `public/thumbnails/{catalogId}.webp` üretin ve `thumbnailUrl` atayın.
 */
export function catalogFallbackThumbnailDataUrl(item: Pick<LibraryItem, 'catalogId' | 'title' | 'category'>): string {
  const hue = hashCatalogId(item.catalogId) % 360
  const hue2 = (hue + 48) % 360
  const initials = item.title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || item.catalogId.slice(0, 2).toUpperCase()
  const cat = escapeXml(item.category.slice(0, 12))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="hsl(${hue} 42% 16%)"/>
      <stop offset="1" stop-color="hsl(${hue2} 38% 26%)"/>
    </linearGradient>
    <filter id="s"><feDropShadow dx="0" dy="1" stdDeviation="0.5" flood-opacity="0.25"/></filter>
  </defs>
  <rect width="360" height="200" fill="url(#g)"/>
  <rect x="16" y="16" width="72" height="22" rx="6" fill="rgba(255,255,255,0.12)" filter="url(#s)"/>
  <text x="24" y="32" fill="rgba(255,255,255,0.85)" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" font-weight="600">${cat}</text>
  <text x="180" y="108" text-anchor="middle" fill="rgba(255,255,255,0.95)" font-family="ui-sans-serif,system-ui,sans-serif" font-size="26" font-weight="700" letter-spacing="-0.04em">${escapeXml(initials)}</text>
  <rect x="120" y="138" width="120" height="3" rx="1.5" fill="rgba(255,255,255,0.25)"/>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function resolveLibraryThumbnail(item: LibraryItem): string {
  if (item.thumbnailUrl) return item.thumbnailUrl
  return catalogFallbackThumbnailDataUrl(item)
}
