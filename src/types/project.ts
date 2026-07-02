export type SiteType = 'ecommerce' | 'corporate'

export type UserRole = 'owner' | 'client'

/** Eski kayıtlarda `tablet` string’i storage migrasyonu ile eşlenir */
export type DevicePreview =
  | 'desktop'
  | 'tabletLandscape'
  | 'tabletPortrait'
  | 'mobile'

export type BlockType =
  | 'heading'
  | 'text'
  | 'hero'
  | 'steps'
  | 'features'
  | 'cta'
  | 'product-grid'
  | 'contact-strip'
  | 'header-nav'
  | 'footer-columns'
  | 'row-2'
  | 'testimonial'
  | 'pricing'
  | 'faq'
  | 'team'
  | 'gallery'
  | 'stats-bar'
  | 'quote'
  | 'blog-cards'
  | 'timeline'
  | 'spacer'
  | 'divider'
  | 'logo-cloud'
  | 'newsletter'
  | 'video-card'
  | 'trust-badges'
  | 'promo-strip'
  | 'category-rail'
  | 'reviews-strip'
  | 'shipping-bar'
  | 'icon-list'
  | 'image-text'
  | 'marquee'
  | 'accordion-pro'
  | 'numbers-band'
  | 'cta-split'
  | 'map-strip'
  | 'social-proof'
  /** Tek görsel — sayfada istenen sıraya sürüklenip bırakılır */
  | 'photo'

export type CanvasZone = 'header' | 'body' | 'footer'

/** Görünür düzen — canvas’ta spacing / hizalama (Style sekmesi) */
export interface BlockLayoutStyle {
  marginTop?: number
  marginBottom?: number
  paddingTop?: number
  paddingBottom?: number
  maxWidth?: 'full' | 'prose' | 'narrow'
  textAlign?: 'left' | 'center' | 'right'
  opacity?: number
  /** Yakınlaştırma % (25–200), 100 = orijinal boyut */
  zoom?: number
  /** Kabuk preset indeksi 0–9 (@see VISUAL_SHELL_VARIANTS) */
  variant?: number
  /** Giriş animasyonu preset id (@see ENTRANCE_PRESETS) */
  entrance?: string
}

export interface BlockInstance {
  id: string
  type: BlockType
  props: Record<string, unknown>
  layout?: BlockLayoutStyle
}

export interface Project {
  schemaVersion: 1
  siteType: SiteType | null
  headerTemplateId: string | null
  footerTemplateId: string | null
  headerBlocks: BlockInstance[]
  footerBlocks: BlockInstance[]
  bodyBlocks: BlockInstance[]
  device: DevicePreview
  previewChrome: boolean
  role: UserRole
}

export function createEmptyProject(): Project {
  return {
    schemaVersion: 1,
    siteType: null,
    headerTemplateId: null,
    footerTemplateId: null,
    headerBlocks: [],
    footerBlocks: [],
    bodyBlocks: [],
    device: 'desktop',
    previewChrome: false,
    role: 'owner',
  }
}
