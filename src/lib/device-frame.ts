import type { DevicePreview } from '@/types/project'

export function deviceLabel(device: DevicePreview): string {
  switch (device) {
    case 'desktop':
      return 'Masaüstü'
    case 'tabletLandscape':
      return 'Tablet (yatay)'
    case 'tabletPortrait':
      return 'Tablet (dikey)'
    case 'mobile':
      return 'Mobil'
    default:
      return 'Önizleme'
  }
}

/** Canvas iç çerçeve genişliği (px) — maxWidth CSS değeri */
export function canvasMaxWidth(device: DevicePreview): string {
  switch (device) {
    case 'desktop':
      return 'min(100%, 1200px)'
    case 'tabletLandscape':
      return 'min(100%, 1024px)'
    case 'tabletPortrait':
      return 'min(100%, 768px)'
    case 'mobile':
      return 'min(100%, 390px)'
    default:
      return '100%'
  }
}

export function canvasMinHeight(device: DevicePreview): string | undefined {
  switch (device) {
    case 'mobile':
      return 'min(640px, 85vh)'
    case 'tabletPortrait':
      return 'min(900px, 88vh)'
    case 'tabletLandscape':
      return 'min(600px, 82vh)'
    default:
      return undefined
  }
}

export function isPhoneFrame(device: DevicePreview): boolean {
  return device === 'mobile'
}

export function isTabletFrame(device: DevicePreview): boolean {
  return device === 'tabletLandscape' || device === 'tabletPortrait'
}
