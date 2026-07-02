import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { BlockInstance } from '@/types/project'
import type { CanvasZone } from '@/types/project'
import { displayTitleForBlockType } from '@/lib/templates'
import { useProject } from '@/context/ProjectContext'
import { cn } from '@/lib/utils'

const ta =
  'flex min-h-[4.5rem] w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

function FooterColumnsFields({
  block,
  zone,
  fi,
}: {
  block: BlockInstance
  zone: CanvasZone
  fi: string
}) {
  const { updateBlockProps } = useProject()
  const cols = (block.props.columns as { title: string; lines: string[] }[]) ?? []
  const [raw, setRaw] = useState(() => JSON.stringify(cols, null, 2))
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    setRaw(
      JSON.stringify(
        (block.props.columns as { title: string; lines: string[] }[]) ?? [],
        null,
        2,
      ),
    )
    setErr(null)
  }, [block.id])

  return (
    <div className="grid gap-3">
      <div className="space-y-1">
        <Label className="text-xs">Alt not</Label>
        <Input
          className={fi}
          value={String(block.props.note ?? '')}
          onChange={(e) => updateBlockProps(zone, block.id, { note: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Sütunlar (JSON)</Label>
        <textarea
          className={cn(ta, fi, 'min-h-[8rem] font-mono')}
          value={raw}
          spellCheck={false}
          onChange={(e) => {
            setRaw(e.target.value)
            setErr(null)
          }}
          onBlur={() => {
            try {
              const parsed = JSON.parse(raw) as unknown
              if (!Array.isArray(parsed)) {
                setErr('Dizi bekleniyor')
                return
              }
              updateBlockProps(zone, block.id, { columns: parsed })
              setErr(null)
            } catch {
              setErr('Geçersiz JSON')
            }
          }}
        />
        {err ? <p className="text-[11px] text-destructive">{err}</p> : null}
      </div>
    </div>
  )
}

function JsonPropsEditor({
  block,
  zone,
  className,
}: {
  block: BlockInstance
  zone: CanvasZone
  className?: string
}) {
  const { updateBlockProps } = useProject()
  const [raw, setRaw] = useState(() => JSON.stringify(block.props, null, 2))
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    setRaw(JSON.stringify(block.props, null, 2))
    setErr(null)
  }, [block.id])

  return (
    <div className={cn('space-y-1', className)}>
      <Label className="text-xs">Özellikler (JSON)</Label>
      <textarea
        className={cn(ta, 'font-mono')}
        value={raw}
        spellCheck={false}
        onChange={(e) => {
          setRaw(e.target.value)
          setErr(null)
        }}
        onBlur={() => {
          try {
            const next = JSON.parse(raw) as Record<string, unknown>
            if (!next || typeof next !== 'object' || Array.isArray(next)) {
              setErr('Nesne bekleniyor')
              return
            }
            updateBlockProps(zone, block.id, next)
            setErr(null)
          } catch {
            setErr('Geçersiz JSON')
          }
        }}
      />
      {err ? <p className="text-[11px] text-destructive">{err}</p> : null}
      <p className="text-[10px] text-muted-foreground">
        Dizi ve iç içe alanlar için bu alanı kullanın; kaydetmek için alanın dışına tıklayın.
      </p>
    </div>
  )
}

export function BlockInspectorFields({
  block,
  zone,
  dense,
  darkMode,
}: {
  block: BlockInstance
  zone: CanvasZone
  dense?: boolean
  darkMode?: boolean
}) {
  const { updateBlockProps, removeBlock, setSelection } = useProject()
  const fi = darkMode
    ? 'border-white/10 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-600'
    : ''
  const lb = darkMode ? 'text-zinc-400' : ''
  const hd = darkMode ? 'text-zinc-100' : ''

  const handledTypes = new Set([
    'heading',
    'text',
    'hero',
    'image-text',
    'photo',
    'video-card',
    'cta',
    'contact-strip',
    'header-nav',
    'footer-columns',
    'product-grid',
    'steps',
    'features',
    'testimonial',
    'promo-strip',
    'reviews-strip',
    'shipping-bar',
    'marquee',
    'category-rail',
    'newsletter',
    'quote',
    'social-proof',
    'spacer',
    'divider',
  ])

  const showJsonFallback = !handledTypes.has(block.type)

  return (
    <div className={cn('space-y-4', dense && 'w-full')}>
      <div>
        <p className={cn('text-[10px] font-semibold uppercase tracking-wide text-muted-foreground', lb)}>
          Öğe
        </p>
        <p className={cn('text-sm font-medium text-foreground', hd)}>
          {displayTitleForBlockType(block.type)} · {zone}
        </p>
      </div>

      {block.type === 'heading' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label htmlFor="fld-text" className="text-xs">
              Metin
            </Label>
            <Input
              id="fld-text"
              className={fi}
              value={String(block.props.text ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { text: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Seviye (1–6)</Label>
            <Input
              type="number"
              min={1}
              max={6}
              className={fi}
              value={String(block.props.level ?? 2)}
              onChange={(e) => {
                const n = Number(e.target.value)
                if (Number.isFinite(n))
                  updateBlockProps(zone, block.id, { level: Math.min(6, Math.max(1, n)) })
              }}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Hiza</Label>
            <select
              className={cn(
                'flex h-9 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm',
                fi,
              )}
              value={String(block.props.align ?? 'left')}
              onChange={(e) =>
                updateBlockProps(zone, block.id, { align: e.target.value })
              }
            >
              <option value="left">Sol</option>
              <option value="center">Orta</option>
              <option value="right">Sağ</option>
            </select>
          </div>
        </div>
      ) : null}

      {block.type === 'text' ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Metin</Label>
            <textarea
              className={cn(ta, fi)}
              value={String(block.props.text ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { text: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Hiza</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm"
              value={String(block.props.align ?? 'left')}
              onChange={(e) =>
                updateBlockProps(zone, block.id, { align: e.target.value })
              }
            >
              <option value="left">Sol</option>
              <option value="center">Orta</option>
              <option value="right">Sağ</option>
            </select>
          </div>
        </div>
      ) : null}

      {block.type === 'hero' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Üst etiket</Label>
            <Input
              className={fi}
              value={String(block.props.eyebrow ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { eyebrow: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Başlık</Label>
            <Input
              className={fi}
              value={String(block.props.title ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Alt başlık</Label>
            <textarea
              className={cn(ta, fi)}
              value={String(block.props.subtitle ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { subtitle: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Birincil düğme</Label>
            <Input
              className={fi}
              value={String(block.props.primaryCta ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { primaryCta: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">İkincil düğme</Label>
            <Input
              className={fi}
              value={String(block.props.secondaryCta ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { secondaryCta: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Arka plan görseli (URL)</Label>
            <Input
              className={fi}
              value={String(block.props.imageUrl ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      ) : null}

      {block.type === 'image-text' ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Görsel URL</Label>
            <Input
              className={fi}
              value={String(block.props.imageUrl ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { imageUrl: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Başlık</Label>
            <Input
              className={fi}
              value={String(block.props.title ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Metin</Label>
            <textarea
              className={cn(ta, fi)}
              value={String(block.props.body ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { body: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Görsel konumu (masaüstü)</Label>
            <select
              className={cn(fi, 'h-9')}
              value={block.props.align === 'right' ? 'right' : 'left'}
              onChange={(e) =>
                updateBlockProps(zone, block.id, {
                  align: e.target.value === 'right' ? 'right' : 'left',
                })
              }
            >
              <option value="left">Görsel solda</option>
              <option value="right">Görsel sağda</option>
            </select>
          </div>
        </div>
      ) : null}

      {block.type === 'photo' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Görsel URL</Label>
            <Input
              className={fi}
              value={String(block.props.imageUrl ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Alt metin (erişilebilirlik)</Label>
            <Input
              className={fi}
              value={String(block.props.alt ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { alt: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Altyazı (isteğe bağlı)</Label>
            <Input
              className={fi}
              value={String(block.props.caption ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { caption: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Oran</Label>
            <select
              className={cn(fi, 'h-9')}
              value={String(block.props.variant ?? 'banner')}
              onChange={(e) => updateBlockProps(zone, block.id, { variant: e.target.value })}
            >
              <option value="banner">Geniş (21:9)</option>
              <option value="square">Kare</option>
              <option value="portrait">Dikey</option>
            </select>
          </div>
        </div>
      ) : null}

      {block.type === 'video-card' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Başlık</Label>
            <Input
              className={fi}
              value={String(block.props.title ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Alt başlık</Label>
            <Input
              className={fi}
              value={String(block.props.subtitle ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { subtitle: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Video URL</Label>
            <Input
              className={fi}
              value={String(block.props.videoUrl ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { videoUrl: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Poster URL</Label>
            <Input
              className={fi}
              value={String(block.props.posterUrl ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { posterUrl: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      {block.type === 'cta' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Başlık</Label>
            <Input
              className={fi}
              value={String(block.props.title ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Alt metin</Label>
            <textarea
              className={cn(ta, fi)}
              value={String(block.props.subtitle ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { subtitle: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Düğme yazısı</Label>
            <Input
              className={fi}
              value={String(block.props.button ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { button: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      {block.type === 'contact-strip' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Başlık</Label>
            <Input
              className={fi}
              value={String(block.props.title ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">E-posta</Label>
            <Input
              className={fi}
              value={String(block.props.email ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Telefon</Label>
            <Input
              className={fi}
              value={String(block.props.phone ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { phone: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      {block.type === 'header-nav' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Marka adı</Label>
            <Input
              className={fi}
              value={String(block.props.brand ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { brand: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Menü linkleri (satır başına bir)</Label>
            <textarea
              className={cn(ta, fi)}
              value={((block.props.links as string[]) ?? []).join('\n')}
              onChange={(e) =>
                updateBlockProps(zone, block.id, {
                  links: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={Boolean(block.props.showCart)}
              onChange={(e) => updateBlockProps(zone, block.id, { showCart: e.target.checked })}
            />
            Sepet rozeti
          </label>
        </div>
      ) : null}

      {block.type === 'footer-columns' ? (
        <FooterColumnsFields block={block} zone={zone} fi={fi} />
      ) : null}

      {block.type === 'product-grid' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Başlık</Label>
            <Input
              className={fi}
              value={String(block.props.title ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Ürün sayısı (1–8)</Label>
            <Input
              type="number"
              min={1}
              max={8}
              className={fi}
              value={String(block.props.count ?? 4)}
              onChange={(e) => {
                const n = Number(e.target.value)
                if (!Number.isFinite(n)) return
                const count = Math.min(8, Math.max(1, n))
                const prev = (block.props.productImages as string[] | undefined) ?? []
                const imgs = prev.slice(0, count)
                while (imgs.length < count) imgs.push('')
                updateBlockProps(zone, block.id, { count, productImages: imgs })
              }}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Görsel URL’leri (satır başına bir)</Label>
            <textarea
              className={cn(ta, fi)}
              value={((block.props.productImages as string[]) ?? []).join('\n')}
              onChange={(e) =>
                updateBlockProps(zone, block.id, {
                  productImages: e.target.value.split('\n').map((s) => s.trim()),
                })
              }
            />
          </div>
        </div>
      ) : null}

      {block.type === 'steps' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Başlık</Label>
            <Input
              className={fi}
              value={String(block.props.title ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Adımlar (satır başına)</Label>
            <textarea
              className={cn(ta, fi)}
              value={((block.props.steps as string[]) ?? []).join('\n')}
              onChange={(e) =>
                updateBlockProps(zone, block.id, {
                  steps: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </div>
      ) : null}

      {block.type === 'features' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Başlık</Label>
            <Input
              className={fi}
              value={String(block.props.title ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Öğeler (satır başına)</Label>
            <textarea
              className={cn(ta, fi)}
              value={((block.props.items as string[]) ?? []).join('\n')}
              onChange={(e) =>
                updateBlockProps(zone, block.id, {
                  items: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </div>
      ) : null}

      {block.type === 'testimonial' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Alıntı</Label>
            <textarea
              className={cn(ta, fi)}
              value={String(block.props.quote ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { quote: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">İsim</Label>
            <Input
              className={fi}
              value={String(block.props.author ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { author: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Ünvan</Label>
            <Input
              className={fi}
              value={String(block.props.role ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { role: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Fotoğraf URL</Label>
            <Input
              className={fi}
              value={String(block.props.photoUrl ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { photoUrl: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      {block.type === 'promo-strip' ? (
        <div className="space-y-1">
          <Label className="text-xs">Metin</Label>
          <textarea
            className={cn(ta, fi)}
            value={String(block.props.text ?? '')}
            onChange={(e) => updateBlockProps(zone, block.id, { text: e.target.value })}
          />
        </div>
      ) : null}

      {block.type === 'reviews-strip' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Puan</Label>
            <Input
              className={fi}
              value={String(block.props.score ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { score: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Değerlendirme metni</Label>
            <Input
              className={fi}
              value={String(block.props.count ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { count: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Kısa yorum</Label>
            <textarea
              className={cn(ta, fi)}
              value={String(block.props.snippet ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { snippet: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      {block.type === 'shipping-bar' ? (
        <div className="space-y-1">
          <Label className="text-xs">Metin</Label>
          <textarea
            className={cn(ta, fi)}
            value={String(block.props.text ?? '')}
            onChange={(e) => updateBlockProps(zone, block.id, { text: e.target.value })}
          />
        </div>
      ) : null}

      {block.type === 'marquee' ? (
        <div className="space-y-1">
          <Label className="text-xs">Öğeler (satır başına)</Label>
          <textarea
            className={cn(ta, fi)}
            value={((block.props.items as string[]) ?? []).join('\n')}
            onChange={(e) =>
              updateBlockProps(zone, block.id, {
                items: e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
      ) : null}

      {block.type === 'category-rail' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Başlık</Label>
            <Input
              className={fi}
              value={String(block.props.title ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Kategoriler (satır başına)</Label>
            <textarea
              className={cn(ta, fi)}
              value={((block.props.cats as string[]) ?? []).join('\n')}
              onChange={(e) =>
                updateBlockProps(zone, block.id, {
                  cats: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </div>
      ) : null}

      {block.type === 'newsletter' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Başlık</Label>
            <Input
              className={fi}
              value={String(block.props.title ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Alt başlık</Label>
            <Input
              className={fi}
              value={String(block.props.subtitle ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { subtitle: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Placeholder</Label>
            <Input
              className={fi}
              value={String(block.props.placeholder ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { placeholder: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Düğme</Label>
            <Input
              className={fi}
              value={String(block.props.button ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { button: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      {block.type === 'quote' ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Alıntı</Label>
            <textarea
              className={cn(ta, fi)}
              value={String(block.props.text ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { text: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Kaynak satırı</Label>
            <Input
              className={fi}
              value={String(block.props.cite ?? '')}
              onChange={(e) => updateBlockProps(zone, block.id, { cite: e.target.value })}
            />
          </div>
        </div>
      ) : null}

      {block.type === 'social-proof' ? (
        <div className="space-y-1">
          <Label className="text-xs">Metin</Label>
          <textarea
            className={cn(ta, fi)}
            value={String(block.props.line ?? '')}
            onChange={(e) => updateBlockProps(zone, block.id, { line: e.target.value })}
          />
        </div>
      ) : null}

      {block.type === 'spacer' ? (
        <div className="space-y-1">
          <Label className="text-xs">Yükseklik (px)</Label>
          <Input
            type="number"
            min={8}
            max={400}
            className={fi}
            value={String(block.props.height ?? 32)}
            onChange={(e) => {
              const n = Number(e.target.value)
              if (Number.isFinite(n)) updateBlockProps(zone, block.id, { height: n })
            }}
          />
        </div>
      ) : null}

      {block.type === 'divider' ? (
        <div className="space-y-1">
          <Label className="text-xs">Stil</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm"
            value={String(block.props.style ?? 'solid')}
            onChange={(e) => updateBlockProps(zone, block.id, { style: e.target.value })}
          >
            <option value="solid">Düz</option>
            <option value="dashed">Kesikli</option>
            <option value="dotted">Noktalı</option>
          </select>
        </div>
      ) : null}

      {showJsonFallback ? <JsonPropsEditor block={block} zone={zone} /> : null}

      <div className="border-t border-border/50 pt-3">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className={dense ? 'w-full' : ''}
          onClick={() => {
            removeBlock(zone, block.id)
            setSelection(null)
          }}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Sil
        </Button>
      </div>
    </div>
  )
}
