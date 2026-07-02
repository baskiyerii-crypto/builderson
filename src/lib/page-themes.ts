import { newId } from '@/lib/id'
import { defaultPropsForType } from '@/lib/templates'
import type { BlockInstance, SiteType } from '@/types/project'

function withIds(blocks: Omit<BlockInstance, 'id'>[]): BlockInstance[] {
  return blocks.map((b) => ({
    ...b,
    id: newId(),
    layout: b.layout,
  }))
}

/** Kurumsal vitrin — gövde blokları (header/footer ayrı) */
export function corporateLandingBody(siteType: SiteType): BlockInstance[] {
  return withIds([
    {
      type: 'hero',
      props: defaultPropsForType('hero', siteType),
      layout: { marginBottom: 24 },
    },
    {
      type: 'features',
      props: defaultPropsForType('features', siteType),
      layout: { marginBottom: 24 },
    },
    {
      type: 'testimonial',
      props: defaultPropsForType('testimonial', siteType),
      layout: { marginBottom: 24 },
    },
    {
      type: 'cta',
      props: defaultPropsForType('cta', siteType),
      layout: { marginBottom: 16 },
    },
  ])
}

/** E-ticaret vitrin gövdesi */
export function ecommerceLandingBody(siteType: SiteType): BlockInstance[] {
  return withIds([
    {
      type: 'hero',
      props: defaultPropsForType('hero', siteType),
      layout: { marginBottom: 20 },
    },
    {
      type: 'promo-strip',
      props: defaultPropsForType('promo-strip', siteType),
      layout: { marginBottom: 16 },
    },
    {
      type: 'product-grid',
      props: defaultPropsForType('product-grid', siteType),
      layout: { marginBottom: 24 },
    },
    {
      type: 'reviews-strip',
      props: defaultPropsForType('reviews-strip', siteType),
      layout: { marginBottom: 16 },
    },
    {
      type: 'cta',
      props: defaultPropsForType('cta', siteType),
    },
  ])
}

export type PageThemeId = 'corporate-landing' | 'ecommerce-landing'

export function applyBodyThemePreset(themeId: PageThemeId, siteType: SiteType): BlockInstance[] {
  if (themeId === 'ecommerce-landing') return ecommerceLandingBody(siteType)
  return corporateLandingBody(siteType)
}
