/** Kabuk görünümü (0–9): çerçeve, köşe, gölge — tüm blok tipleri için */
export const VISUAL_SHELL_VARIANTS: { label: string; classes: string }[] = [
  { label: 'Varsayılan', classes: '' },
  { label: 'Kart', classes: 'rounded-xl border border-slate-200/90 bg-white/80 shadow-md' },
  { label: 'Yumuşak', classes: 'rounded-2xl border border-slate-100 bg-white/90 shadow-lg shadow-slate-200/50' },
  { label: 'Çerçeve', classes: 'rounded-lg border-2 border-slate-300 bg-slate-50/90' },
  { label: 'Vurgu', classes: 'rounded-xl border border-primary/25 bg-primary/[0.04] shadow-sm ring-1 ring-primary/15' },
  { label: 'Koyu şerit', classes: 'rounded-xl border border-slate-800/20 bg-slate-900/[0.03] shadow-inner' },
  { label: 'Cam', classes: 'rounded-2xl border border-white/40 bg-white/60 shadow-xl backdrop-blur-md' },
  { label: 'Neon', classes: 'rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-50/80 to-violet-50/60 shadow-[0_0_24px_rgba(34,211,238,0.25)]' },
  { label: 'Minimal', classes: 'rounded-md border-b-2 border-slate-900/80 bg-transparent pb-1 shadow-none' },
  { label: 'Poster', classes: 'rounded-2xl border-8 border-white shadow-2xl ring-1 ring-slate-200' },
]

/** Giriş animasyonu (tw-animate) — seçimde blok sarmalayıcısına uygulanır */
export const ENTRANCE_PRESETS: { id: string; label: string; classes: string }[] = [
  { id: 'none', label: 'Yok', classes: '' },
  { id: 'fade', label: 'Belir', classes: 'animate-in fade-in duration-500' },
  { id: 'fade-up', label: 'Alttan', classes: 'animate-in fade-in slide-in-from-bottom-6 duration-500' },
  { id: 'fade-down', label: 'Üstten', classes: 'animate-in fade-in slide-in-from-top-6 duration-500' },
  { id: 'from-left', label: 'Soldan', classes: 'animate-in fade-in slide-in-from-left-8 duration-500' },
  { id: 'from-right', label: 'Sağdan', classes: 'animate-in fade-in slide-in-from-right-8 duration-500' },
  { id: 'zoom', label: 'Yakınlaş', classes: 'animate-in fade-in zoom-in-95 duration-500' },
  { id: 'zoom-lg', label: 'Büyük zoom', classes: 'animate-in fade-in zoom-in-90 duration-600' },
  { id: 'blur', label: 'Yumuşak', classes: 'animate-in fade-in slide-in-from-bottom-2 duration-700' },
  { id: 'bounce', label: 'Sıçra', classes: 'animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700' },
]

export function clampVariantIndex(i: number | undefined): number {
  if (i === undefined || Number.isNaN(i)) return 0
  return Math.min(9, Math.max(0, Math.floor(i)))
}

export function entranceClasses(id: string | undefined): string {
  if (!id || id === 'none') return ''
  const p = ENTRANCE_PRESETS.find((e) => e.id === id)
  return p?.classes ?? ''
}
