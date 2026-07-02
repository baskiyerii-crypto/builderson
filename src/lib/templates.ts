import {
  DEMO_SAMPLE_VIDEO,
  DEMO_SAMPLE_VIDEO_POSTER,
  demoGalleryImages,
  demoHeroImage,
  demoPic,
  demoProductImages,
  demoTeamPhotos,
} from '@/lib/demo-assets'
import type { BlockSupplySource } from '@/lib/block-supply-plan'
import { newId } from '@/lib/id'
import type { BlockInstance, BlockType, CanvasZone, SiteType } from '@/types/project'

function withIds(blocks: Omit<BlockInstance, 'id'>[]): BlockInstance[] {
  return blocks.map((b) => ({ ...b, id: newId() }))
}

export const headerTemplatePresets: Record<
  string,
  Omit<BlockInstance, 'id'>[]
> = {
  minimal: [
    {
      type: 'header-nav',
      props: {
        brand: 'Markanız',
        links: ['Ürünler', 'Hakkımızda', 'İletişim'],
        variant: 'minimal',
      },
    },
  ],
  commerce: [
    {
      type: 'header-nav',
      props: {
        brand: 'Mağaza',
        links: ['Koleksiyon', 'İndirim', 'Sepet'],
        variant: 'commerce',
        showCart: true,
      },
    },
  ],
  bold: [
    {
      type: 'heading',
      props: { text: 'STUDIO', level: 3, align: 'center' },
    },
    {
      type: 'header-nav',
      props: {
        brand: '',
        links: ['Projeler', 'Blog', 'İletişim'],
        variant: 'minimal',
      },
    },
  ],
}

export const footerTemplatePresets: Record<
  string,
  Omit<BlockInstance, 'id'>[]
> = {
  simple: [
    {
      type: 'footer-columns',
      props: {
        columns: [
          { title: 'Şirket', lines: ['Hakkımızda', 'Kariyer'] },
          { title: 'Destek', lines: ['SSS', 'İletişim'] },
        ],
        note: '© 2026 Tüm hakları saklıdır.',
      },
    },
  ],
  ecommerce: [
    {
      type: 'footer-columns',
      props: {
        columns: [
          { title: 'Alışveriş', lines: ['Kargo', 'İade', 'Ödeme'] },
          { title: 'Hesap', lines: ['Siparişlerim', 'Adreslerim'] },
        ],
        note: 'Güvenli ödeme · SSL',
      },
    },
  ],
}

export function instantiateTemplate(
  preset: Record<string, Omit<BlockInstance, 'id'>[]>,
  id: string,
): BlockInstance[] {
  const blocks = preset[id]
  if (!blocks) return []
  return withIds(blocks)
}

export type LibraryCategory =
  | 'Layout'
  | 'Header'
  | 'Footer'
  | 'Hero'
  | 'Content'
  | 'Steps'
  | 'Features'
  | 'CTA'
  | 'Commerce'
  | 'Social'
  | 'Media'

export type LibrarySiteScope = 'corporate' | 'ecommerce' | 'both'

export type LibraryKind = 'section' | 'component' | 'button'

export interface LibraryItem {
  /** Katalogda benzersiz anahtar (aynı block type için çoklu varyant) */
  catalogId: string
  type: BlockType
  title: string
  category: LibraryCategory
  /** Hangi site türlerinde listelensin */
  sites: LibrarySiteScope
  /** Kütüphane sekmesi: bölüm / bileşen / aksiyon */
  kind: LibraryKind
  /** Varsayılan props ile birleştirilir — önizleme ve ekleme */
  presetOverrides?: Record<string, unknown>
  /** Örn. Playwright export: `/thumbnails/{catalogId}.webp` — yoksa SVG üretilir */
  thumbnailUrl?: string
  /** Lisans / provenance (toplu Tailwind UI import yok) */
  supplySource?: BlockSupplySource
  /** AI sektör evrimi: slot adı → props yolu (örn. image_url → imageUrl) */
  aiBindings?: Record<string, string>
}

export const ORDER: LibraryCategory[] = [
  'Layout',
  'Header',
  'Hero',
  'Content',
  'Commerce',
  'Features',
  'Steps',
  'CTA',
  'Social',
  'Media',
  'Footer',
]

export const libraryItems: LibraryItem[] = [
  { catalogId: 'layout-row-2', kind: 'section', type: 'row-2', title: '2 sütun satır', category: 'Layout', sites: 'both' },
  { catalogId: 'hdr-nav-default', kind: 'section', type: 'header-nav', title: 'Üst menü', category: 'Header', sites: 'both' },
  {
    catalogId: 'hdr-shipping',
    kind: 'section',
    type: 'shipping-bar',
    title: 'Ücretsiz kargo şeridi',
    category: 'Header',
    sites: 'ecommerce',
  },
  {
    catalogId: 'hero-default',
    kind: 'section',
    type: 'hero',
    title: 'Hero — vitrin',
    category: 'Hero',
    sites: 'both',
    thumbnailUrl: demoPic('lib-hero-default', 720, 400),
    supplySource: 'internal',
    aiBindings: { title: 'title', description: 'subtitle', image_url: 'imageUrl' },
  },
  {
    catalogId: 'hero-compact',
    kind: 'section',
    type: 'hero',
    title: 'Hero — kompakt',
    category: 'Hero',
    sites: 'both',
    presetOverrides: {
      eyebrow: 'Öne çıkan',
      title: 'Tek satırda güçlü mesaj',
      subtitle: 'Alt metin kısa tutuldu; mobilde okunaklı.',
      primaryCta: 'Keşfet',
      secondaryCta: 'Detay',
    },
  },
  {
    catalogId: 'hero-ecom-flash',
    kind: 'section',
    type: 'hero',
    title: 'Hero — kampanya',
    category: 'Hero',
    sites: 'ecommerce',
    presetOverrides: {
      eyebrow: 'Flash indirim',
      title: '%40’a varan fırsatlar',
      subtitle: 'Seçili ürünlerde + ücretsiz kargo.',
      primaryCta: 'Fırsatlara git',
      secondaryCta: 'Koleksiyon',
    },
  },
  { catalogId: 'hero-promo-strip', kind: 'section', type: 'promo-strip', title: 'Promo şerit', category: 'Hero', sites: 'ecommerce' },
  { catalogId: 'hero-marquee', kind: 'section', type: 'marquee', title: 'Duyuru bandı', category: 'Hero', sites: 'both' },
  {
    catalogId: 'hero-marquee-min',
    kind: 'section',
    type: 'marquee',
    title: 'Duyuru — kısa',
    category: 'Hero',
    sites: 'both',
    presetOverrides: { items: ['Yeni sezon', 'Ücretsiz kargo', 'Kolay iade'] },
  },
  { catalogId: 'txt-heading-default', kind: 'component', type: 'heading', title: 'Başlık — standart', category: 'Content', sites: 'both' },
  {
    catalogId: 'txt-heading-display',
    kind: 'component',
    type: 'heading',
    title: 'Başlık — vitrin (H1)',
    category: 'Content',
    sites: 'both',
    presetOverrides: { level: 1, text: 'Markanızı büyütün', align: 'center' },
  },
  {
    catalogId: 'txt-heading-kicker',
    kind: 'component',
    type: 'heading',
    title: 'Başlık — alt başlık (H3)',
    category: 'Content',
    sites: 'both',
    presetOverrides: { level: 3, text: 'Bölüm etiketi', align: 'left' },
  },
  { catalogId: 'txt-paragraph', kind: 'component', type: 'text', title: 'Paragraf', category: 'Content', sites: 'both' },
  {
    catalogId: 'txt-lead',
    kind: 'component',
    type: 'text',
    title: 'Paragraf — giriş metni',
    category: 'Content',
    sites: 'both',
    presetOverrides: {
      text: 'Kısa ve net bir giriş paragrafı. Hizmetinizi veya ürününüzü özetleyin; ziyaretçiyi aşağıya yönlendirin.',
    },
  },
  {
    catalogId: 'media-photo-banner',
    kind: 'component',
    type: 'photo',
    title: 'Görsel — geniş banner',
    category: 'Media',
    sites: 'both',
    presetOverrides: {
      variant: 'banner',
      caption: 'Ürün veya kampanya görseli',
      imageUrl: demoPic('photoban', 1600, 720),
    },
  },
  {
    catalogId: 'media-photo-square',
    kind: 'component',
    type: 'photo',
    title: 'Görsel — kare',
    category: 'Media',
    sites: 'both',
    presetOverrides: {
      variant: 'square',
      caption: 'Kare kırpma — grid uyumlu',
      imageUrl: demoPic('photosq', 960, 960),
    },
  },
  {
    catalogId: 'media-photo-portrait',
    kind: 'component',
    type: 'photo',
    title: 'Görsel — dikey',
    category: 'Media',
    sites: 'both',
    presetOverrides: {
      variant: 'portrait',
      caption: 'Portre / lookbook',
      imageUrl: demoPic('photoport', 900, 1200),
    },
  },
  { catalogId: 'content-image-text', kind: 'section', type: 'image-text', title: 'Görsel + metin', category: 'Content', sites: 'both' },
  {
    catalogId: 'content-image-text-right',
    kind: 'section',
    type: 'image-text',
    title: 'Görsel + metin — görsel sağda',
    category: 'Content',
    sites: 'both',
    presetOverrides: { align: 'right', title: 'Metin solda, görsel sağda', body: 'İki sütun dengesi ile okuma akışı.' },
  },
  { catalogId: 'content-icon-list', kind: 'section', type: 'icon-list', title: 'İkon listesi', category: 'Content', sites: 'both' },
  { catalogId: 'content-quote', kind: 'component', type: 'quote', title: 'Alıntı', category: 'Content', sites: 'corporate' },
  { catalogId: 'content-blog-cards', kind: 'section', type: 'blog-cards', title: 'Blog kartları', category: 'Content', sites: 'corporate' },
  { catalogId: 'content-timeline', kind: 'section', type: 'timeline', title: 'Zaman çizelgesi', category: 'Content', sites: 'corporate' },
  { catalogId: 'content-faq', kind: 'section', type: 'faq', title: 'SSS / Akordeon', category: 'Content', sites: 'both' },
  { catalogId: 'content-accordion-pro', kind: 'section', type: 'accordion-pro', title: 'Akordeon (detay)', category: 'Content', sites: 'both' },
  { catalogId: 'content-spacer-sm', kind: 'component', type: 'spacer', title: 'Boşluk — S', category: 'Content', sites: 'both', presetOverrides: { height: 24 } },
  { catalogId: 'content-spacer-lg', kind: 'component', type: 'spacer', title: 'Boşluk — L', category: 'Content', sites: 'both', presetOverrides: { height: 64 } },
  { catalogId: 'content-divider', kind: 'component', type: 'divider', title: 'Ayırıcı çizgi', category: 'Content', sites: 'both' },
  { catalogId: 'steps-default', kind: 'section', type: 'steps', title: 'Adımlar', category: 'Steps', sites: 'both' },
  {
    catalogId: 'steps-short',
    kind: 'section',
    type: 'steps',
    title: 'Adımlar — 3 kademe',
    category: 'Steps',
    sites: 'both',
    presetOverrides: { title: '3 adımda hazırsınız', steps: ['Kayıt', 'Ödeme', 'Yayın'] },
  },
  {
    catalogId: 'feat-grid',
    kind: 'section',
    type: 'features',
    title: 'Özellik ızgarası',
    category: 'Features',
    sites: 'both',
    thumbnailUrl: demoPic('lib-features', 720, 380),
    supplySource: 'flowbite_mit',
    aiBindings: { title: 'title' },
  },
  {
    catalogId: 'feat-grid-short',
    kind: 'section',
    type: 'features',
    title: 'Özellikler — kısa liste',
    category: 'Features',
    sites: 'both',
    presetOverrides: { title: 'Neden biz?', items: ['Hızlı', 'Güvenilir', 'Şeffaf fiyat'] },
  },
  { catalogId: 'feat-stats', kind: 'section', type: 'stats-bar', title: 'İstatistik bandı', category: 'Features', sites: 'both' },
  {
    catalogId: 'feat-numbers',
    kind: 'section',
    type: 'numbers-band',
    title: 'Rakamlar şeridi',
    category: 'Features',
    sites: 'corporate',
  },
  { catalogId: 'soc-team', kind: 'section', type: 'team', title: 'Ekip', category: 'Social', sites: 'corporate' },
  { catalogId: 'soc-testimonial', kind: 'component', type: 'testimonial', title: 'Referans', category: 'Social', sites: 'both' },
  {
    catalogId: 'soc-testimonial-long',
    kind: 'component',
    type: 'testimonial',
    title: 'Referans — uzun alıntı',
    category: 'Social',
    sites: 'both',
    presetOverrides: {
      quote:
        'Platform sayesinde vitrin sayfamızı saatler içinde güncelledik; dönüşüm gözle görülür şekilde arttı.',
      author: 'Mehmet Kaya',
      role: 'Kurucu, Demo Ltd.',
    },
  },
  { catalogId: 'soc-reviews', kind: 'section', type: 'reviews-strip', title: 'Yorum şeridi', category: 'Social', sites: 'ecommerce' },
  { catalogId: 'soc-logos', kind: 'section', type: 'logo-cloud', title: 'Logo bulutu', category: 'Social', sites: 'both' },
  { catalogId: 'soc-proof', kind: 'section', type: 'social-proof', title: 'Güven rozetleri', category: 'Social', sites: 'ecommerce' },
  { catalogId: 'com-trust', kind: 'section', type: 'trust-badges', title: 'Ödeme güveni', category: 'Commerce', sites: 'ecommerce' },
  { catalogId: 'com-cats', kind: 'section', type: 'category-rail', title: 'Kategori şeridi', category: 'Commerce', sites: 'ecommerce' },
  {
    catalogId: 'com-products',
    kind: 'section',
    type: 'product-grid',
    title: 'Ürün ızgarası',
    category: 'Commerce',
    sites: 'ecommerce',
    thumbnailUrl: demoPic('lib-product-grid', 720, 400),
    supplySource: 'hyperui_mit',
    aiBindings: { title: 'title' },
  },
  {
    catalogId: 'com-products-6',
    kind: 'section',
    type: 'product-grid',
    title: 'Ürün ızgarası — 6 ürün',
    category: 'Commerce',
    sites: 'ecommerce',
    presetOverrides: { title: 'Çok satanlar', count: 6, productImages: demoProductImages(6) },
  },
  { catalogId: 'com-pricing', kind: 'section', type: 'pricing', title: 'Fiyat tablosu', category: 'Commerce', sites: 'corporate' },
  { catalogId: 'med-gallery', kind: 'section', type: 'gallery', title: 'Galeri', category: 'Media', sites: 'both' },
  { catalogId: 'med-video', kind: 'section', type: 'video-card', title: 'Video kartı', category: 'Media', sites: 'both' },
  { catalogId: 'btn-newsletter', kind: 'button', type: 'newsletter', title: 'Bülten kayıt', category: 'Content', sites: 'both' },
  {
    catalogId: 'btn-newsletter-min',
    kind: 'button',
    type: 'newsletter',
    title: 'Bülten — minimal',
    category: 'Content',
    sites: 'both',
    presetOverrides: { title: 'E-posta listesi', subtitle: 'Ayda bir özet.', button: 'Abone ol' },
  },
  { catalogId: 'btn-cta', kind: 'button', type: 'cta', title: 'CTA kutusu', category: 'CTA', sites: 'both' },
  {
    catalogId: 'btn-cta-bold',
    kind: 'button',
    type: 'cta',
    title: 'CTA — güçlü başlık',
    category: 'CTA',
    sites: 'both',
    presetOverrides: { title: 'Hemen başlayın', subtitle: 'Kurulum 10 dakika.', button: 'Ücretsiz dene' },
  },
  {
    catalogId: 'btn-cta-ecom',
    kind: 'button',
    type: 'cta',
    title: 'CTA — alışverişe çağrı',
    category: 'CTA',
    sites: 'ecommerce',
    presetOverrides: {
      title: 'Sepetiniz hazır mı?',
      subtitle: 'Bugün kargo bedava.',
      button: 'Alışverişe devam',
    },
  },
  { catalogId: 'btn-cta-split', kind: 'button', type: 'cta-split', title: 'CTA ikiye bölünmüş', category: 'CTA', sites: 'both' },
  {
    catalogId: 'content-contact',
    kind: 'section',
    type: 'contact-strip',
    title: 'İletişim şeridi',
    category: 'Content',
    sites: 'both',
    thumbnailUrl: demoPic('lib-contact', 720, 360),
    supplySource: 'shadcn_ecosystem',
    aiBindings: { title: 'title', description: 'email' },
  },
  { catalogId: 'content-map', kind: 'section', type: 'map-strip', title: 'Harita bandı', category: 'Content', sites: 'corporate' },
  {
    catalogId: 'layout-row-wide-gap',
    kind: 'section',
    type: 'row-2',
    title: '2 sütun — geniş boşluk',
    category: 'Layout',
    sites: 'both',
    presetOverrides: { gap: 'lg' },
  },
  {
    catalogId: 'hdr-nav-tight',
    kind: 'section',
    type: 'header-nav',
    title: 'Üst menü — kompakt marka',
    category: 'Header',
    sites: 'both',
    presetOverrides: { brand: 'STUDIO', links: ['İşler', 'Hizmet', 'İletişim'], variant: 'minimal' },
  },
  {
    catalogId: 'hdr-nav-store',
    kind: 'section',
    type: 'header-nav',
    title: 'Üst menü — mağaza + sepet',
    category: 'Header',
    sites: 'ecommerce',
    presetOverrides: {
      brand: 'Outlet',
      links: ['İndirim', 'Yeni', 'Sepet'],
      variant: 'commerce',
      showCart: true,
    },
  },
  {
    catalogId: 'hero-corp-pitch',
    kind: 'section',
    type: 'hero',
    title: 'Hero — ajans vitrin',
    category: 'Hero',
    sites: 'corporate',
    presetOverrides: {
      eyebrow: 'Strateji · Tasarım · Kod',
      title: 'Dijital ürünlerinizi hızla yayına alın',
      subtitle: 'Keşiften teslimata tek ekip; ölçülebilir sonuçlar.',
      primaryCta: 'Teklif iste',
      secondaryCta: 'Referanslar',
    },
  },
  {
    catalogId: 'hero-ecom-season',
    kind: 'section',
    type: 'hero',
    title: 'Hero — sezon vitrin',
    category: 'Hero',
    sites: 'ecommerce',
    presetOverrides: {
      eyebrow: 'Sezon sonu',
      title: 'Seçili ürünlerde ekstra indirim',
      subtitle: 'Stoklar tükenene kadar; ücretsiz kargo.',
      primaryCta: 'Alışverişe başla',
      secondaryCta: 'Lookbook',
    },
  },
  {
    catalogId: 'hero-marquee-long',
    kind: 'section',
    type: 'marquee',
    title: 'Duyuru — uzun şerit',
    category: 'Hero',
    sites: 'both',
    presetOverrides: {
      items: ['Yeni koleksiyon', '3 taksit', 'Kolay iade', 'Mağazadan teslim', 'Güvenli ödeme'],
    },
  },
  {
    catalogId: 'promo-flash',
    kind: 'section',
    type: 'promo-strip',
    title: 'Promo — sepete özel',
    category: 'Hero',
    sites: 'ecommerce',
    presetOverrides: { text: 'Sepette ek %10 · Kod: EXTRA10 · Bugün sona eriyor' },
  },
  {
    catalogId: 'txt-heading-h2-right',
    kind: 'component',
    type: 'heading',
    title: 'Başlık — sağa hizalı',
    category: 'Content',
    sites: 'both',
    presetOverrides: { level: 2, text: 'Sağa hizalı bölüm', align: 'right' },
  },
  {
    catalogId: 'txt-paragraph-long',
    kind: 'component',
    type: 'text',
    title: 'Paragraf — uzun metin',
    category: 'Content',
    sites: 'both',
    presetOverrides: {
      text: 'Bu paragraf daha uzun bir metin örneği sunar. Ürün açıklaması, hizmet detayı veya blog girişi gibi çok satırlı içeriklerin kütüphanede nasıl görüneceğini gösterir.',
    },
  },
  {
    catalogId: 'content-faq-tiny',
    kind: 'section',
    type: 'faq',
    title: 'SSS — mini (2 soru)',
    category: 'Content',
    sites: 'both',
    presetOverrides: {
      title: 'Hızlı cevaplar',
      items: [
        { q: 'Teslim süresi?', a: '2–5 iş günü.' },
        { q: 'Destek?', a: 'Hafta içi 09–18.' },
      ],
    },
  },
  {
    catalogId: 'accordion-short',
    kind: 'section',
    type: 'accordion-pro',
    title: 'Akordeon — kısa',
    category: 'Content',
    sites: 'both',
    presetOverrides: {
      title: 'Detaylar',
      rows: [
        { t: 'Garanti', d: '2 yıl üretici garantisi.' },
        { t: 'İade', d: '14 gün içinde ücretsiz.' },
      ],
    },
  },
  {
    catalogId: 'blog-cards-tiny',
    kind: 'section',
    type: 'blog-cards',
    title: 'Blog — 2 yazı',
    category: 'Content',
    sites: 'corporate',
    presetOverrides: {
      title: 'Yazılarımız',
      posts: ['Performans', 'Tasarım'],
      postImages: [demoPic('blogtiny-0', 640, 400), demoPic('blogtiny-1', 640, 400)],
    },
  },
  {
    catalogId: 'timeline-short',
    kind: 'section',
    type: 'timeline',
    title: 'Zaman çizelgesi — 4 olay',
    category: 'Content',
    sites: 'corporate',
    presetOverrides: { title: 'Kilometre taşları', events: ['2019', '2021', '2023', '2025'] },
  },
  {
    catalogId: 'icon-list-rich',
    kind: 'section',
    type: 'icon-list',
    title: 'İkon listesi — 4 madde',
    category: 'Content',
    sites: 'both',
    presetOverrides: {
      title: 'Paket özellikleri',
      items: [
        { t: 'SLA', d: '99.9% uptime hedefi' },
        { t: 'Güvenlik', d: 'SOC2 benzeri süreçler' },
        { t: 'Ölçek', d: 'Otomatik yatay büyüme' },
        { t: 'Destek', d: 'Öncelikli kanal' },
      ],
    },
  },
  {
    catalogId: 'image-text-product',
    kind: 'section',
    type: 'image-text',
    title: 'Görsel + metin — ürün odaklı',
    category: 'Content',
    sites: 'both',
    presetOverrides: {
      title: 'Ürün hikayesi',
      body: 'Malzeme, kullanım senaryosu ve bakım bilgisi ile güven oluşturun.',
      align: 'left',
      imageUrl: demoPic('imgtext-prod', 960, 720),
    },
  },
  {
    catalogId: 'steps-five',
    kind: 'section',
    type: 'steps',
    title: 'Adımlar — 5 aşama',
    category: 'Steps',
    sites: 'both',
    presetOverrides: {
      title: 'Kurulum akışı',
      steps: ['Kayıt', 'Doğrulama', 'Tema', 'İçerik', 'Yayın'],
    },
  },
  {
    catalogId: 'features-six',
    kind: 'section',
    type: 'features',
    title: 'Özellikler — 6 madde',
    category: 'Features',
    sites: 'both',
    presetOverrides: {
      title: 'Teknik üstünlükler',
      items: ['API', 'Webhook', 'SSO', 'Log', 'Alert', 'Yedek'],
    },
  },
  {
    catalogId: 'stats-four',
    kind: 'section',
    type: 'stats-bar',
    title: 'İstatistik — 4 KPI',
    category: 'Features',
    sites: 'both',
    presetOverrides: {
      stats: [
        { label: 'Aktif kullanıcı', value: '48K' },
        { label: 'Ülke', value: '32' },
        { label: 'Uptime', value: '99.95%' },
        { label: 'Destek', value: '<15dk' },
      ],
    },
  },
  {
    catalogId: 'numbers-ecom',
    kind: 'section',
    type: 'numbers-band',
    title: 'Rakamlar — e-ticaret',
    category: 'Features',
    sites: 'ecommerce',
    presetOverrides: {
      items: [
        { n: '2M+', l: 'Gönderi' },
        { n: '24s', l: 'Kargo çıkışı' },
        { n: '%4.9', l: 'Memnuniyet' },
      ],
    },
  },
  {
    catalogId: 'gallery-nine',
    kind: 'section',
    type: 'gallery',
    title: 'Galeri — 9 görsel',
    category: 'Media',
    sites: 'both',
    presetOverrides: { title: 'Mekân / etkinlik', count: 9, galleryImages: demoGalleryImages(9) },
  },
  {
    catalogId: 'video-webinar',
    kind: 'section',
    type: 'video-card',
    title: 'Video — webinarya kartı',
    category: 'Media',
    sites: 'both',
    presetOverrides: {
      title: 'Canlı yayın tekrarı',
      subtitle: '45 dk · Soru-cevap dahil',
      duration: '45:00',
    },
  },
  {
    catalogId: 'com-products-3',
    kind: 'section',
    type: 'product-grid',
    title: 'Ürün ızgarası — 3 ürün',
    category: 'Commerce',
    sites: 'ecommerce',
    presetOverrides: { title: 'Editörün seçimi', count: 3, productImages: demoProductImages(3) },
  },
  {
    catalogId: 'com-products-8',
    kind: 'section',
    type: 'product-grid',
    title: 'Ürün ızgarası — 8 ürün',
    category: 'Commerce',
    sites: 'ecommerce',
    presetOverrides: { title: 'Yeni gelenler', count: 8, productImages: demoProductImages(8) },
  },
  {
    catalogId: 'category-rail-short',
    kind: 'section',
    type: 'category-rail',
    title: 'Kategori — kısa şerit',
    category: 'Commerce',
    sites: 'ecommerce',
    presetOverrides: { title: 'Popüler', cats: ['Gömlek', 'Pantolon', 'Ayakkabı'] },
  },
  {
    catalogId: 'trust-badges-long',
    kind: 'section',
    type: 'trust-badges',
    title: 'Ödeme güveni — geniş',
    category: 'Commerce',
    sites: 'ecommerce',
    presetOverrides: { labels: ['3D Secure', 'Taksit', '256-bit SSL', 'Kolay iade', 'Müşteri hizmetleri'] },
  },
  {
    catalogId: 'reviews-snippet',
    kind: 'section',
    type: 'reviews-strip',
    title: 'Yorumlar — kısa alıntı',
    category: 'Social',
    sites: 'ecommerce',
    presetOverrides: { score: '4.9', count: '3.102 yorum', snippet: 'Ürün kalitesi ve paketleme mükemmel.' },
  },
  {
    catalogId: 'logo-cloud-eight',
    kind: 'section',
    type: 'logo-cloud',
    title: 'Logo bulutu — 8 marka',
    category: 'Social',
    sites: 'both',
    presetOverrides: {
      title: 'İş ortaklarımız',
      logos: ['Nova', 'Pulse', 'Vertex', 'Orbit', 'Helix', 'Apex', 'Stride', 'Craft'],
    },
  },
  {
    catalogId: 'social-proof-2',
    kind: 'section',
    type: 'social-proof',
    title: 'Güven — stok uyarısı',
    category: 'Social',
    sites: 'ecommerce',
    presetOverrides: { line: 'Son 1 saatte 42 kişi bu ürünü inceledi · Stok azalıyor' },
  },
  {
    catalogId: 'team-six',
    kind: 'section',
    type: 'team',
    title: 'Ekip — 6 kişi',
    category: 'Social',
    sites: 'corporate',
    presetOverrides: {
      title: 'Liderlik ekibi',
      members: ['CEO', 'CTO', 'Tasarım', 'Ürün', 'Satış', 'Destek'],
      memberPhotos: demoTeamPhotos(6),
    },
  },
  {
    catalogId: 'testimonial-short',
    kind: 'component',
    type: 'testimonial',
    title: 'Referans — kısa',
    category: 'Social',
    sites: 'both',
    presetOverrides: { quote: 'Hızlı ve profesyonel.', author: 'Zeynep A.', role: 'PM' },
  },
  {
    catalogId: 'quote-modern',
    kind: 'component',
    type: 'quote',
    title: 'Alıntı — modern',
    category: 'Content',
    sites: 'corporate',
    presetOverrides: { text: 'Tasarım, işin görünen yüzüdür; sistem ise görünmeyen gücü.', cite: '— Ekip notu' },
  },
  {
    catalogId: 'pricing-startup',
    kind: 'section',
    type: 'pricing',
    title: 'Fiyat — startup üçlü',
    category: 'Commerce',
    sites: 'corporate',
    presetOverrides: {
      title: 'Basit fiyatlar',
      plans: [
        { name: 'Starter', price: '₺199', feats: ['5 kullanıcı', 'Temel rapor'] },
        { name: 'Growth', price: '₺499', feats: ['Sınırsız proje', 'Öncelik'] },
        { name: 'Scale', price: 'Özel', feats: ['SLA', 'Dedicated'] },
      ],
    },
  },
  {
    catalogId: 'contact-strip-bold',
    kind: 'section',
    type: 'contact-strip',
    title: 'İletişim — vurgulu',
    category: 'Content',
    sites: 'both',
    presetOverrides: {
      title: 'Proje konuşalım',
      email: 'hello@sirket.com',
      phone: '+90 216 000 00 00',
    },
  },
  {
    catalogId: 'map-strip-detail',
    kind: 'section',
    type: 'map-strip',
    title: 'Harita — adres + not',
    category: 'Content',
    sites: 'corporate',
    presetOverrides: {
      title: 'Showroom',
      address: 'Maslak, İstanbul',
      note: 'Randevu ile ziyaret · Otopark mevcut',
    },
  },
  {
    catalogId: 'shipping-express',
    kind: 'section',
    type: 'shipping-bar',
    title: 'Kargo — express şerit',
    category: 'Header',
    sites: 'ecommerce',
    presetOverrides: { text: '14:00’ye kadar verilen siparişler aynı gün kargoda' },
  },
  {
    catalogId: 'content-spacer-xl',
    kind: 'component',
    type: 'spacer',
    title: 'Boşluk — XL',
    category: 'Content',
    sites: 'both',
    presetOverrides: { height: 120 },
  },
  {
    catalogId: 'content-divider-dashed',
    kind: 'component',
    type: 'divider',
    title: 'Çizgi — kesik stil',
    category: 'Content',
    sites: 'both',
    presetOverrides: { style: 'dashed' },
  },
  {
    catalogId: 'btn-cta-split-min',
    kind: 'button',
    type: 'cta-split',
    title: 'CTA split — kısa metin',
    category: 'CTA',
    sites: 'both',
    presetOverrides: { left: 'Demo iste', right: '15 dk', button: 'Planla' },
  },
  {
    catalogId: 'btn-newsletter-wide',
    kind: 'button',
    type: 'newsletter',
    title: 'Bülten — geniş başlık',
    category: 'Content',
    sites: 'both',
    presetOverrides: {
      title: 'Haftalık içgörü bülteni',
      subtitle: 'Tasarım ve ürün notları; istediğiniz zaman ayrılın.',
      placeholder: 'is@mail.com',
      button: 'Kaydol',
    },
  },
  {
    catalogId: 'media-photo-landscape',
    kind: 'component',
    type: 'photo',
    title: 'Görsel — manzara',
    category: 'Media',
    sites: 'both',
    presetOverrides: {
      variant: 'banner',
      caption: 'Geniş manzara örneği',
      imageUrl: demoPic('photoland', 1600, 640),
    },
  },
  {
    catalogId: 'foot-columns-min',
    kind: 'section',
    type: 'footer-columns',
    title: 'Footer — minimal sütun',
    category: 'Footer',
    sites: 'both',
    presetOverrides: {
      columns: [{ title: 'Şirket', lines: ['Hakkımızda'] }, { title: 'Destek', lines: ['İletişim'] }],
      note: '© 2026',
    },
  },
  { catalogId: 'foot-columns', kind: 'section', type: 'footer-columns', title: 'Footer sütunları', category: 'Footer', sites: 'both' },
]

export function libraryItemsForSite(siteType: SiteType | null): LibraryItem[] {
  if (!siteType) return libraryItems.filter((i) => i.sites === 'both')
  return libraryItems.filter((i) => i.sites === 'both' || i.sites === siteType)
}

export function libraryItemsForSiteAndKind(
  siteType: SiteType | null,
  kind: LibraryKind,
): LibraryItem[] {
  return libraryItemsForSite(siteType).filter((i) => i.kind === kind)
}

const blockTypeTitles = new Map<BlockType, string>()
for (const i of libraryItems) {
  if (!blockTypeTitles.has(i.type)) blockTypeTitles.set(i.type, i.title)
}

export function displayTitleForBlockType(type: BlockType): string {
  return blockTypeTitles.get(type) ?? type
}

export function libraryItemKey(item: LibraryItem): string {
  return item.catalogId
}

/** Blok hangi bölgelere bırakılabilir */
export function allowedZonesForBlock(type: BlockType): CanvasZone[] {
  switch (type) {
    case 'header-nav':
    case 'shipping-bar':
      return ['header', 'body']
    case 'footer-columns':
      return ['footer']
    case 'row-2':
      return ['body']
    default:
      return ['body', 'header', 'footer']
  }
}

export function canPlaceBlock(type: BlockType, zone: CanvasZone): boolean {
  return allowedZonesForBlock(type).includes(zone)
}

export function defaultPropsForType(
  type: BlockType,
  siteType?: SiteType | null,
): Record<string, unknown> {
  const isEcom = siteType === 'ecommerce'
  switch (type) {
    case 'heading':
      return { text: 'Yeni başlık', level: 2, align: 'left' }
    case 'text':
      return {
        text: 'Paragraf metni. Ön yüzden veya sağ panelden düzenleyin.',
      }
    case 'hero':
      return {
        eyebrow: isEcom ? 'Yeni sezon' : 'Ajansınız',
        title: isEcom ? 'Koleksiyonu keşfedin' : 'Dijitalde fark yaratın',
        subtitle: isEcom
          ? 'Ücretsiz kargo ve kolay iade ile güvenli alışveriş.'
          : 'Strateji, tasarım ve geliştirme ile markanızı büyütün.',
        primaryCta: isEcom ? 'Alışverişe başla' : 'Teklif al',
        secondaryCta: isEcom ? 'Lookbook' : 'Portfolyo',
        imageUrl: demoHeroImage(isEcom ? 'ecom' : 'corp'),
      }
    case 'steps':
      return {
        title: '4 basit adımda başlayın',
        steps: ['Kayıt', 'Kurulum', 'Tasarım', 'Yayın'],
      }
    case 'features':
      return {
        title: 'Öne çıkan özellikler',
        items: ['Hızlı', 'Güvenli', 'Ölçeklenebilir', 'Destek'],
      }
    case 'cta':
      return {
        title: 'Hemen başlayın',
        subtitle: 'Kredi kartı gerekmez.',
        button: 'Ücretsiz dene',
      }
    case 'product-grid': {
      const count = 4
      return { title: 'Öne çıkan ürünler', count, productImages: demoProductImages(count) }
    }
    case 'contact-strip':
      return {
        title: 'Bize ulaşın',
        email: 'hello@ornek.com',
        phone: '+90 212 000 00 00',
      }
    case 'header-nav':
      return {
        brand: isEcom ? 'Mağaza' : 'Markanız',
        links: isEcom
          ? ['Yeni', 'İndirim', 'Kategoriler', 'İletişim']
          : ['Hizmetler', 'Projeler', 'Blog', 'İletişim'],
        variant: isEcom ? 'commerce' : 'minimal',
        showCart: isEcom,
      }
    case 'footer-columns':
      return {
        columns: [
          { title: 'Kurumsal', lines: ['Hakkımızda', 'Kariyer'] },
          { title: 'Yasal', lines: ['Gizlilik', 'KVKK'] },
        ],
        note: '© 2026',
      }
    case 'row-2':
      return { col0: [], col1: [], gap: 'md' }
    case 'testimonial':
      return {
        quote: 'Ekibin hızı ve kalitesi beklentimizin üzerindeydi.',
        author: 'Ayşe Yılmaz',
        role: 'CMO, Örnek A.Ş.',
        photoUrl: demoPic('testimonial-avatar', 200, 200),
      }
    case 'pricing':
      return {
        title: 'Planlar',
        plans: [
          { name: 'Başlangıç', price: '₺0', feats: ['1 site', 'E-posta'] },
          { name: 'Pro', price: '₺299', feats: ['10 site', 'Öncelik'] },
          { name: 'Kurumsal', price: 'Özel', feats: ['SLA', 'Destek'] },
        ],
      }
    case 'faq':
      return {
        title: 'Sık sorulanlar',
        items: [
          { q: 'Teslim süresi?', a: 'Proje kapsamına göre 2–6 hafta.' },
          { q: 'Revizyon var mı?', a: 'Evet, pakete göre tur sayısı belirlenir.' },
        ],
      }
    case 'team': {
      const members = ['Ürün', 'Tasarım', 'Geliştirme', 'Destek']
      return {
        title: 'Ekibimiz',
        members,
        memberPhotos: demoTeamPhotos(members.length),
      }
    }
    case 'gallery': {
      const count = 6
      return { title: 'Galeri', count, galleryImages: demoGalleryImages(count) }
    }
    case 'stats-bar':
      return {
        stats: [
          { label: 'Müşteri', value: '2.4K' },
          { label: 'Proje', value: '180+' },
          { label: 'NPS', value: '62' },
        ],
      }
    case 'quote':
      return {
        text: 'Basitlik, sofistikasyonun en yüksek derecesidir.',
        cite: '— Da Vinci',
      }
    case 'blog-cards': {
      const posts = ['UX trendleri', 'Performans ipuçları', 'Tasarım sistemleri']
      return {
        title: 'Blogdan',
        posts,
        postImages: posts.map((_, i) => demoPic(`blog-${i}`, 640, 400)),
      }
    }
    case 'timeline':
      return {
        title: 'Yolculuğumuz',
        events: ['2018 Kuruluş', '2021 Seri A', '2024 Global'],
      }
    case 'spacer':
      return { height: 32 }
    case 'divider':
      return { style: 'solid' }
    case 'logo-cloud':
      return { title: 'Bize güvenenler', logos: ['ACME', 'Globex', 'Umbrella', 'Stark'] }
    case 'newsletter':
      return {
        title: 'Bültene katılın',
        subtitle: 'Ayda bir özet, spam yok.',
        placeholder: 'E-posta adresiniz',
        button: 'Kaydol',
      }
    case 'video-card':
      return {
        title: 'Tanıtım videosu',
        subtitle: '60 sn’de ürününüzü anlatın.',
        duration: '0:15',
        videoUrl: DEMO_SAMPLE_VIDEO,
        posterUrl: DEMO_SAMPLE_VIDEO_POSTER,
      }
    case 'trust-badges':
      return { labels: ['256-bit SSL', '3D Secure', 'Kolay iade'] }
    case 'promo-strip':
      return { text: '%20 indirim · Seçili ürünlerde geçerli · Kod: BAHAR20' }
    case 'category-rail':
      return {
        title: 'Kategoriler',
        cats: ['Giyim', 'Ayakkabı', 'Aksesuar', 'Ev', 'Teknoloji'],
      }
    case 'reviews-strip':
      return {
        score: '4.8',
        count: '1.240 değerlendirme',
        snippet: 'Kargo hızlı, ürün aynı göründüğü gibi.',
      }
    case 'shipping-bar':
      return { text: '750₺ üzeri siparişlerde ücretsiz kargo' }
    case 'icon-list':
      return {
        title: 'Neden biz?',
        items: [
          { t: 'Hızlı kurulum', d: 'Dakikalar içinde yayına' },
          { t: 'Güvenli altyapı', d: 'Modern stack ve yedekleme' },
        ],
      }
    case 'image-text':
      return {
        title: 'Güçlü bir ilk izlenim',
        body: 'Görsel ve metni dengeleyerek dönüşüm oranını artırın.',
        align: 'left',
        imageUrl: demoPic('imagetext-main', 900, 700),
      }
    case 'marquee':
      return {
        items: ['Yeni koleksiyon', 'Ücretsiz kargo', '3 taksit', 'Kolay iade'],
      }
    case 'accordion-pro':
      return {
        title: 'Detaylar',
        rows: [
          { t: 'Kargo', d: '24-48 saat içinde kargoya verilir.' },
          { t: 'İade', d: '14 gün içinde ücretsiz iade.' },
        ],
      }
    case 'numbers-band':
      return {
        items: [
          { n: '12', l: 'Yıl tecrübe' },
          { n: '45', l: 'Uzman' },
          { n: '8', l: 'Ülke' },
        ],
      }
    case 'cta-split':
      return {
        left: 'Hazır mısınız?',
        right: '15 dk’lık görüşme planlayın',
        button: 'Randevu al',
      }
    case 'map-strip':
      return { title: 'Ofis', address: 'Levent, İstanbul', note: 'Harita entegrasyonu için placeholder' }
    case 'social-proof':
      return { line: 'Son 24 saatte 128 kişi bu ürünlere baktı' }
    case 'photo':
      return {
        imageUrl: demoPic('photo-block', 1600, 820),
        alt: 'Görsel',
        caption: '',
        variant: 'banner',
      }
    default:
      return {}
  }
}

/** Palet, ekleme ve sürükle-bırak için birleşik başlangıç props’ları */
export function mergeBlockProps(
  type: BlockType,
  siteType: SiteType | null | undefined,
  preset?: Record<string, unknown>,
): Record<string, unknown> {
  return { ...defaultPropsForType(type, siteType), ...(preset ?? {}) }
}
