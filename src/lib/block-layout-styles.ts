import type { CSSProperties } from 'react'
import type { BlockLayoutStyle } from '@/types/project'
import { clampVariantIndex, entranceClasses, VISUAL_SHELL_VARIANTS } from '@/lib/block-presets'
import { cn } from '@/lib/utils'

/** Canvas’ta `block.layout` → görünür margin/padding/hizalama */
export function blockLayoutSurfaceProps(layout?: BlockLayoutStyle): {
  className: string
  style: CSSProperties
} {
  if (!layout) return { className: '', style: {} }
  const style: CSSProperties = {}
  if (layout.marginTop != null) style.marginTop = layout.marginTop
  if (layout.marginBottom != null) style.marginBottom = layout.marginBottom
  if (layout.paddingTop != null) style.paddingTop = layout.paddingTop
  if (layout.paddingBottom != null) style.paddingBottom = layout.paddingBottom
  if (layout.opacity != null) {
    let o = Number(layout.opacity)
    if (o > 1) o /= 100
    style.opacity = Math.min(1, Math.max(0, o))
  }
  if (layout.zoom != null) {
    const z = Math.min(200, Math.max(25, layout.zoom)) / 100
    style.transform = `scale(${z})`
    style.transformOrigin = 'top center'
  }

  const maxW =
    layout.maxWidth === 'full'
      ? 'w-full max-w-none'
      : layout.maxWidth === 'prose'
        ? 'mx-auto w-full max-w-prose'
        : layout.maxWidth === 'narrow'
          ? 'mx-auto w-full max-w-xl'
          : ''

  const align =
    layout.textAlign === 'left'
      ? 'text-left'
      : layout.textAlign === 'center'
        ? 'text-center'
        : layout.textAlign === 'right'
          ? 'text-right'
          : ''

  const vi = clampVariantIndex(layout.variant)
  const shell = VISUAL_SHELL_VARIANTS[vi]?.classes ?? ''
  const enter = entranceClasses(layout.entrance)

  return { className: cn('w-full min-w-0', maxW, align, shell, enter), style }
}
