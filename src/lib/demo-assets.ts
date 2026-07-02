/** Sabit CDN örnekleri — palet ve yeni bloklar dolu önizleme göstersin */

export function demoPic(seed: string, w = 800, h = 600): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`
}

export const DEMO_SAMPLE_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

export const DEMO_SAMPLE_VIDEO_POSTER = demoPic('videoposter', 1280, 720)

export function demoHeroImage(siteKey: string): string {
  return demoPic(`hero-${siteKey}`, 1600, 900)
}

export function demoProductImages(count: number): string[] {
  return Array.from({ length: count }, (_, i) => demoPic(`prd-${i}`, 600, 600))
}

export function demoGalleryImages(count: number): string[] {
  return Array.from({ length: count }, (_, i) => demoPic(`gal-${i}`, 600, 600))
}

export function demoTeamPhotos(count: number): string[] {
  return Array.from({ length: count }, (_, i) => demoPic(`team-${i}`, 400, 400))
}
