import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useProject } from '@/context/ProjectContext'
import {
  clampVariantIndex,
  ENTRANCE_PRESETS,
  VISUAL_SHELL_VARIANTS,
} from '@/lib/block-presets'
import type { BlockInstance, BlockLayoutStyle, CanvasZone } from '@/types/project'
import { cn } from '@/lib/utils'

export function BlockStylePanel({ block, zone }: { block: BlockInstance; zone: CanvasZone }) {
  const { updateBlockLayout } = useProject()
  const L = block.layout ?? {}
  const set = (patch: Partial<BlockLayoutStyle>) => updateBlockLayout(zone, block.id, patch)

  const num = (k: keyof BlockLayoutStyle, label: string, suffix = 'px') => (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        min={0}
        className="h-8 border-border bg-background text-xs"
        value={L[k] !== undefined ? String(L[k]) : ''}
        placeholder="0"
        onChange={(e) => {
          const v = e.target.value
          if (v === '') return
          const n = Number(v)
          if (Number.isFinite(n)) set({ [k]: n } as Partial<BlockLayoutStyle>)
        }}
      />
      {suffix ? <span className="sr-only">{suffix}</span> : null}
    </div>
  )

  const vIdx = clampVariantIndex(L.variant)

  return (
    <div className="space-y-4 text-foreground">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Görünüm şablonu (10)
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {VISUAL_SHELL_VARIANTS.map((v, i) => (
          <button
            key={v.label}
            type="button"
            title={v.label}
            onClick={() => set({ variant: i })}
            className={cn(
              'flex h-16 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border bg-gradient-to-br from-slate-50 to-slate-100/90 p-1 text-[9px] font-medium text-slate-600 transition-all',
              vIdx === i
                ? 'border-[#3899ec] ring-2 ring-[#3899ec]/30'
                : 'border-slate-200 hover:border-slate-300',
            )}
          >
            <span
              className={cn(
                'flex h-9 w-full items-center justify-center rounded-md border border-slate-200/80 bg-white text-[10px] text-slate-400',
                v.classes,
              )}
            >
              {i + 1}
            </span>
            <span className="max-w-full truncate px-0.5">{v.label}</span>
          </button>
        ))}
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Giriş animasyonu (10)
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ENTRANCE_PRESETS.map((p) => {
          const active = (L.entrance ?? 'none') === p.id
          return (
            <button
              key={p.id}
              type="button"
              title={p.label}
              onClick={() => set({ entrance: p.id })}
              className={cn(
                'flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg border bg-muted/30 p-1 text-[9px] font-medium transition-all',
                active
                  ? 'border-[#3899ec] ring-2 ring-[#3899ec]/30'
                  : 'border-border hover:bg-muted/50',
              )}
            >
              <span className="flex h-9 w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/25 bg-background text-[10px] text-muted-foreground">
                {p.id === 'none' ? '—' : '▶'}
              </span>
              <span className="max-w-full truncate px-0.5">{p.label}</span>
            </button>
          )
        })}
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Boşluk
      </p>
      <div className="grid grid-cols-2 gap-2">
        {num('marginTop', 'Üst margin')}
        {num('marginBottom', 'Alt margin')}
        {num('paddingTop', 'Üst padding')}
        {num('paddingBottom', 'Alt padding')}
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Maks. genişlik</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm"
          value={L.maxWidth ?? 'full'}
          onChange={(e) =>
            set({ maxWidth: e.target.value as BlockLayoutStyle['maxWidth'] })
          }
        >
          <option value="full">Tam</option>
          <option value="prose">Prose</option>
          <option value="narrow">Dar</option>
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Metin hizası</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm"
          value={L.textAlign ?? 'left'}
          onChange={(e) =>
            set({ textAlign: e.target.value as BlockLayoutStyle['textAlign'] })
          }
        >
          <option value="left">Sol</option>
          <option value="center">Orta</option>
          <option value="right">Sağ</option>
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Opaklık (%)</Label>
        <Input
          type="number"
          min={0}
          max={100}
          className="h-8 border-border bg-background text-xs"
          value={
            L.opacity === undefined
              ? '100'
              : L.opacity > 1
                ? String(Math.round(Number(L.opacity)))
                : String(Math.round(Number(L.opacity) * 100))
          }
          onChange={(e) => {
            const n = Number(e.target.value)
            if (Number.isFinite(n)) set({ opacity: Math.min(100, Math.max(0, n)) / 100 })
          }}
        />
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Boyut
      </p>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Yakınlaştırma (%)</Label>
        <Input
          type="number"
          min={25}
          max={200}
          step={5}
          className="h-8 border-border bg-background text-xs"
          value={L.zoom !== undefined ? String(L.zoom) : '100'}
          onChange={(e) => {
            const n = Number(e.target.value)
            if (Number.isFinite(n)) set({ zoom: Math.min(200, Math.max(25, n)) })
          }}
        />
        <p className="text-[10px] text-muted-foreground">100 = orijinal; üst merkezden ölçeklenir.</p>
      </div>
      <button
        type="button"
        className="text-xs font-medium text-[#116dff] underline-offset-2 hover:underline"
        onClick={() =>
          set({
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            maxWidth: 'full',
            textAlign: 'left',
            opacity: 1,
            zoom: 100,
            variant: 0,
            entrance: 'none',
          })
        }
      >
        Stili sıfırla
      </button>
    </div>
  )
}
