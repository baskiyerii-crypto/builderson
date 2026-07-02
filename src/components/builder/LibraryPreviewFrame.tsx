import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Kütüphane / sürükleme önizlemesi — ızgara zemin, derinlik, “taslak” hissi */
export function LibraryPreviewFrame({
  children,
  className,
  tall,
  variant = 'default',
  label = 'Önizleme',
  showBadge = true,
}: {
  children: ReactNode
  className?: string
  /** Daha yüksek kart (sol kütüphane) */
  tall?: boolean
  /** `palette`: sabit min-height yok, içerik kadar yükseklik — boş alan azaltılır */
  variant?: 'default' | 'palette'
  label?: string
  showBadge?: boolean
}) {
  const palette = variant === 'palette'
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-slate-200/95 bg-gradient-to-br from-slate-100/95 via-white to-slate-50/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.04)]',
        !palette && (tall ? 'min-h-[11.5rem]' : 'min-h-[8.75rem]'),
        palette && 'min-h-0',
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:14px_14px] [background-position:center_top]',
          palette ? 'opacity-[0.28]' : 'opacity-[0.42]',
        )}
        aria-hidden
      />
      {!palette ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-7 bg-gradient-to-b from-white/95 to-transparent" />
      ) : null}
      {showBadge && label ? (
        <span className="pointer-events-none absolute left-2 top-2 z-[2] rounded-md bg-white/95 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500 shadow-sm ring-1 ring-slate-200/90">
          {label}
        </span>
      ) : null}
      <div
        className={cn(
          'relative z-0 mx-auto w-full max-w-none',
          palette ? 'px-1 py-1' : cn('px-2 pb-2', showBadge ? (tall ? 'pt-8' : 'pt-7') : tall ? 'pt-3 pb-3' : 'pt-2.5'),
        )}
      >
        {children}
      </div>
    </div>
  )
}
