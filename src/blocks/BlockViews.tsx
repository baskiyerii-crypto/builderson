import { getRowColumns } from '@/lib/block-tree'
import { cn } from '@/lib/utils'
import type { BlockInstance } from '@/types/project'

function alignClass(align?: unknown): string {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

export function BlockViews({
  block,
  selected,
  onSelect,
  inlineEdit,
  readOnly,
  onTextCommit,
}: {
  block: BlockInstance
  selected: boolean
  onSelect: () => void
  inlineEdit: boolean
  readOnly?: boolean
  onTextCommit?: (next: string) => void
}) {
  const ring = selected && !readOnly ? 'ring-2 ring-[#2563eb] ring-offset-2' : ''

  switch (block.type) {
    case 'heading': {
      const text = String(block.props.text ?? '')
      const level = Math.min(6, Math.max(1, Number(block.props.level ?? 2)))
      const size =
        level <= 1
          ? 'text-3xl md:text-4xl'
          : level === 2
            ? 'text-2xl md:text-3xl'
            : 'text-xl md:text-2xl'
      return (
        <div
          className={cn('relative rounded-md', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute -top-2 left-0 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Text
            </span>
          ) : null}
          <h2
            className={cn(
              'font-semibold tracking-tight text-foreground',
              alignClass(block.props.align),
              size,
            )}
            contentEditable={inlineEdit && selected}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!inlineEdit || !selected) return
              onTextCommit?.(e.currentTarget.textContent ?? '')
            }}
          >
            {text}
          </h2>
        </div>
      )
    }
    case 'text': {
      const text = String(block.props.text ?? '')
      return (
        <div
          className={cn('relative max-w-prose rounded-md', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute -top-2 left-0 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Text
            </span>
          ) : null}
          <p
            className={cn(
              'text-muted-foreground leading-relaxed',
              alignClass(block.props.align),
            )}
            contentEditable={inlineEdit && selected}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!inlineEdit || !selected) return
              onTextCommit?.(e.currentTarget.textContent ?? '')
            }}
          >
            {text}
          </p>
        </div>
      )
    }
    case 'hero': {
      const eyebrow = String(block.props.eyebrow ?? '')
      const title = String(block.props.title ?? '')
      const subtitle = String(block.props.subtitle ?? '')
      const primaryCta = String(block.props.primaryCta ?? '')
      const secondaryCta = String(block.props.secondaryCta ?? '')
      const imageUrl = String(block.props.imageUrl ?? '')
      return (
        <div
          className={cn('relative overflow-hidden rounded-xl border', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-background/30" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          )}
          <div className="relative p-8 md:p-12">
            {selected && !readOnly ? (
              <span className="absolute left-4 top-4 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Section
              </span>
            ) : null}
            <p className="text-sm font-medium text-primary">{eyebrow}</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                {primaryCta}
              </span>
              <span className="rounded-md border border-white/20 bg-background/90 px-4 py-2 text-sm font-medium backdrop-blur">
                {secondaryCta}
              </span>
            </div>
          </div>
        </div>
      )
    }
    case 'steps': {
      const title = String(block.props.title ?? '')
      const steps = (block.props.steps as string[]) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute left-3 top-3 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Steps
            </span>
          ) : null}
          <h3 className="text-lg font-semibold">{title}</h3>
          <ol className="mt-4 grid gap-3 md:grid-cols-2">
            {steps.map((s, i) => (
              <li
                key={`${s}-${i}`}
                className="flex gap-3 rounded-lg border bg-background/60 p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm leading-snug">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )
    }
    case 'features': {
      const title = String(block.props.title ?? '')
      const items = (block.props.items as string[]) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute left-3 top-3 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Features
            </span>
          ) : null}
          <h3 className="text-lg font-semibold">{title}</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {items.map((s) => (
              <li
                key={s}
                className="rounded-lg border bg-background/60 p-4 text-sm font-medium"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )
    }
    case 'cta': {
      const title = String(block.props.title ?? '')
      const subtitle = String(block.props.subtitle ?? '')
      const button = String(block.props.button ?? '')
      return (
        <div
          className={cn(
            'relative flex flex-col items-center rounded-xl border bg-muted/40 px-6 py-10 text-center',
            ring,
          )}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute left-3 top-3 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              CTA
            </span>
          ) : null}
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{subtitle}</p>
          <span className="mt-5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            {button}
          </span>
        </div>
      )
    }
    case 'product-grid': {
      const title = String(block.props.title ?? '')
      const count = Math.min(8, Math.max(1, Number(block.props.count ?? 4)))
      const productImages = (block.props.productImages as string[] | undefined) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute left-3 top-3 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Commerce
            </span>
          ) : null}
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg border bg-muted">
                {productImages[i] ? (
                  <img src={productImages[i]} alt="" className="size-full object-cover" />
                ) : (
                  <div className="size-full bg-gradient-to-br from-muted to-background" />
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'contact-strip': {
      const title = String(block.props.title ?? '')
      const email = String(block.props.email ?? '')
      const phone = String(block.props.phone ?? '')
      return (
        <div
          className={cn(
            'relative flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4',
            ring,
          )}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute left-2 top-2 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Contact
            </span>
          ) : null}
          <p className="text-sm font-medium">{title}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{email}</span>
            <span>{phone}</span>
          </div>
        </div>
      )
    }
    case 'header-nav': {
      const brand = String(block.props.brand ?? '')
      const links = (block.props.links as string[]) ?? []
      const variant = String(block.props.variant ?? 'minimal')
      const showCart = Boolean(block.props.showCart)
      return (
        <header
          className={cn(
            'relative flex flex-wrap items-center justify-between gap-4 border-b bg-background/80 px-4 py-3 backdrop-blur',
            variant === 'commerce' && 'border-primary/20',
            ring,
          )}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute left-2 top-1 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Header
            </span>
          ) : null}
          <span className="text-base font-bold tracking-tight">{brand}</span>
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {links.map((l) => (
              <span key={l} className="cursor-default hover:text-foreground">
                {l}
              </span>
            ))}
          </nav>
          {showCart ? (
            <span className="rounded-full border px-3 py-1 text-xs font-medium">
              Sepet (0)
            </span>
          ) : null}
        </header>
      )
    }
    case 'footer-columns': {
      const columns =
        (block.props.columns as { title: string; lines: string[] }[]) ?? []
      const note = String(block.props.note ?? '')
      return (
        <footer
          className={cn(
            'relative grid gap-6 border-t bg-muted/30 px-4 py-8 md:grid-cols-3',
            ring,
          )}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute left-2 top-2 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Footer
            </span>
          ) : null}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold">{col.title}</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {col.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-xs text-muted-foreground md:col-span-3">{note}</p>
        </footer>
      )
    }
    case 'row-2': {
      const [c0, c1] = getRowColumns(block)
      const tight = readOnly
      return (
        <div
          className={cn('relative rounded-xl border bg-muted/15', tight ? 'p-2' : 'p-3', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute left-2 top-2 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Row
            </span>
          ) : null}
          <div className={cn('grid md:grid-cols-2', tight ? 'mt-0 gap-2' : 'mt-5 gap-3')}>
            <div
              className={cn(
                'rounded-lg border border-dashed bg-background/80',
                tight ? 'min-h-0 space-y-1.5 p-1.5' : 'min-h-[3rem] space-y-2 p-2',
              )}
            >
              {c0.map((ch) => (
                <BlockViews
                  key={ch.id}
                  block={ch}
                  selected={false}
                  onSelect={() => {}}
                  inlineEdit={false}
                  readOnly
                />
              ))}
            </div>
            <div
              className={cn(
                'rounded-lg border border-dashed bg-background/80',
                tight ? 'min-h-0 space-y-1.5 p-1.5' : 'min-h-[3rem] space-y-2 p-2',
              )}
            >
              {c1.map((ch) => (
                <BlockViews
                  key={ch.id}
                  block={ch}
                  selected={false}
                  onSelect={() => {}}
                  inlineEdit={false}
                  readOnly
                />
              ))}
            </div>
          </div>
        </div>
      )
    }
    case 'testimonial': {
      const quote = String(block.props.quote ?? '')
      const author = String(block.props.author ?? '')
      const role = String(block.props.role ?? '')
      const photoUrl = String(block.props.photoUrl ?? '')
      return (
        <div
          className={cn('relative flex gap-4 rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt=""
              className="size-14 shrink-0 rounded-full object-cover ring-2 ring-border"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-lg leading-relaxed text-foreground">&ldquo;{quote}&rdquo;</p>
            <p className="mt-3 text-sm font-semibold">{author}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      )
    }
    case 'pricing': {
      const title = String(block.props.title ?? '')
      const plans = (block.props.plans as { name: string; price: string; feats: string[] }[]) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className="rounded-lg border bg-background p-4">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="mt-2 text-2xl font-bold">{p.price}</p>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {p.feats.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'faq':
    case 'accordion-pro': {
      const title = String(block.props.title ?? '')
      const items =
        (block.props.items as { q: string; a: string }[]) ??
        (block.props.rows as { t: string; d: string }[] | undefined)?.map((r) => ({
          q: r.t,
          a: r.d,
        })) ??
        []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="mt-4 divide-y rounded-lg border">
            {items.map((it) => (
              <div key={it.q} className="px-4 py-3">
                <p className="text-sm font-medium">{it.q}</p>
                <p className="mt-1 text-xs text-muted-foreground">{it.a}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'team': {
      const title = String(block.props.title ?? '')
      const members = (block.props.members as string[]) ?? []
      const memberPhotos = (block.props.memberPhotos as string[] | undefined) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {members.map((m, i) => (
              <div
                key={m}
                className="overflow-hidden rounded-lg border bg-muted/40 text-center text-sm font-medium"
              >
                {memberPhotos[i] ? (
                  <img src={memberPhotos[i]} alt="" className="aspect-square w-full object-cover" />
                ) : null}
                <div className="p-3">{m}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'gallery': {
      const title = String(block.props.title ?? '')
      const count = Math.min(9, Math.max(3, Number(block.props.count ?? 6)))
      const galleryImages = (block.props.galleryImages as string[] | undefined) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-md bg-muted">
                {galleryImages[i] ? (
                  <img src={galleryImages[i]} alt="" className="size-full object-cover" />
                ) : (
                  <div className="size-full bg-gradient-to-br from-muted to-background" />
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'stats-bar': {
      const stats = (block.props.stats as { label: string; value: string }[]) ?? []
      return (
        <div
          className={cn(
            'relative flex flex-wrap justify-between gap-4 rounded-xl border bg-primary/5 px-6 py-5',
            ring,
          )}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      )
    }
    case 'quote': {
      const text = String(block.props.text ?? '')
      const cite = String(block.props.cite ?? '')
      return (
        <div
          className={cn('relative border-l-4 border-primary py-2 pl-4', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <p className="text-lg italic text-muted-foreground">{text}</p>
          <p className="mt-2 text-sm font-medium">{cite}</p>
        </div>
      )
    }
    case 'blog-cards': {
      const title = String(block.props.title ?? '')
      const posts = (block.props.posts as string[]) ?? []
      const postImages = (block.props.postImages as string[] | undefined) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {posts.map((p, i) => (
              <div key={p} className="overflow-hidden rounded-lg border bg-background">
                {postImages[i] ? (
                  <img src={postImages[i]} alt="" className="aspect-[16/10] w-full object-cover" />
                ) : null}
                <div className="p-3 text-sm font-medium">{p}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'timeline': {
      const title = String(block.props.title ?? '')
      const events = (block.props.events as string[]) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <ul className="mt-4 space-y-3 border-l-2 border-muted pl-4">
            {events.map((ev) => (
              <li key={ev} className="relative text-sm">
                <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                {ev}
              </li>
            ))}
          </ul>
        </div>
      )
    }
    case 'spacer': {
      const h = Number(block.props.height ?? 24)
      return (
        <div
          className={cn('relative', ring)}
          style={{ height: h }}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-muted-foreground/30" />
        </div>
      )
    }
    case 'divider': {
      const lineStyle = block.props.style === 'dashed' ? 'border-dashed' : 'border-solid'
      return (
        <div
          className={cn('relative py-2', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <hr className={cn('border-t border-muted-foreground/35', lineStyle)} />
        </div>
      )
    }
    case 'logo-cloud': {
      const title = String(block.props.title ?? '')
      const logos = (block.props.logos as string[]) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-muted/30 px-6 py-8', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 opacity-70">
            {logos.map((l) => (
              <span key={l} className="text-sm font-bold text-foreground">
                {l}
              </span>
            ))}
          </div>
        </div>
      )
    }
    case 'newsletter': {
      const title = String(block.props.title ?? '')
      const subtitle = String(block.props.subtitle ?? '')
      const placeholder = String(block.props.placeholder ?? '')
      const button = String(block.props.button ?? '')
      return (
        <div
          className={cn(
            'relative flex flex-col items-center rounded-xl border bg-gradient-to-r from-primary/10 to-background px-6 py-8 text-center md:flex-row md:justify-between md:text-left',
            ring,
          )}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="mt-4 flex gap-2 md:mt-0">
            <span className="rounded-md border bg-background px-3 py-2 text-xs text-muted-foreground">
              {placeholder}
            </span>
            <span className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
              {button}
            </span>
          </div>
        </div>
      )
    }
    case 'video-card': {
      const title = String(block.props.title ?? '')
      const subtitle = String(block.props.subtitle ?? '')
      const duration = String(block.props.duration ?? '')
      const videoUrl = String(block.props.videoUrl ?? '')
      const posterUrl = String(block.props.posterUrl ?? '')
      return (
        <div
          className={cn('relative overflow-hidden rounded-xl border bg-card', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <div className="relative aspect-video bg-black">
            {videoUrl ? (
              <video
                className="size-full object-cover"
                src={videoUrl}
                poster={posterUrl || undefined}
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-muted">
                <span className="rounded-full border bg-background px-3 py-1 text-xs font-medium">
                  ▶ {duration}
                </span>
              </div>
            )}
            {videoUrl && duration ? (
              <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
                {duration}
              </span>
            ) : null}
          </div>
          <div className="p-4">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      )
    }
    case 'trust-badges': {
      const labels = (block.props.labels as string[]) ?? []
      return (
        <div
          className={cn('flex flex-wrap justify-center gap-3 rounded-lg border bg-card px-4 py-3', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {labels.map((l) => (
            <span key={l} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {l}
            </span>
          ))}
        </div>
      )
    }
    case 'promo-strip': {
      const text = String(block.props.text ?? '')
      return (
        <div
          className={cn(
            'relative rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 text-center text-sm font-medium',
            ring,
          )}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {text}
        </div>
      )
    }
    case 'category-rail': {
      const title = String(block.props.title ?? '')
      const cats = (block.props.cats as string[]) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-4', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {cats.map((c) => (
              <span key={c} className="shrink-0 rounded-full border bg-background px-3 py-1 text-xs">
                {c}
              </span>
            ))}
          </div>
        </div>
      )
    }
    case 'reviews-strip': {
      const score = String(block.props.score ?? '')
      const count = String(block.props.count ?? '')
      const snippet = String(block.props.snippet ?? '')
      return (
        <div
          className={cn('flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <span className="text-lg font-bold text-amber-500">★ {score}</span>
          <span className="text-xs text-muted-foreground">{count}</span>
          <span className="text-sm text-muted-foreground">&ldquo;{snippet}&rdquo;</span>
        </div>
      )
    }
    case 'shipping-bar': {
      const text = String(block.props.text ?? '')
      return (
        <div
          className={cn('rounded-md bg-emerald-500/15 px-4 py-2 text-center text-xs font-medium text-emerald-800 dark:text-emerald-200', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {text}
        </div>
      )
    }
    case 'icon-list': {
      const title = String(block.props.title ?? '')
      const items = (block.props.items as { t: string; d: string }[]) ?? []
      return (
        <div
          className={cn('relative rounded-xl border bg-card p-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <ul className="mt-4 space-y-3">
            {items.map((it) => (
              <li key={it.t} className="flex gap-3 text-sm">
                <span className="mt-0.5 size-6 shrink-0 rounded-full bg-primary/15 text-center text-xs leading-6 text-primary">
                  ✓
                </span>
                <div>
                  <p className="font-medium">{it.t}</p>
                  <p className="text-muted-foreground">{it.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )
    }
    case 'image-text': {
      const title = String(block.props.title ?? '')
      const body = String(block.props.body ?? '')
      const imageUrl = String(block.props.imageUrl ?? '')
      const imageRight = block.props.align === 'right'
      return (
        <div
          className={cn(
            'relative flex flex-col gap-4 rounded-xl border bg-card p-6 md:flex-row md:items-center',
            imageRight && 'md:flex-row-reverse',
            ring,
          )}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <div className="aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-muted md:max-w-[50%]">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="size-full bg-gradient-to-br from-muted to-background" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        </div>
      )
    }
    case 'photo': {
      const src = String(block.props.imageUrl ?? '')
      const caption = String(block.props.caption ?? '')
      const variant = String(block.props.variant ?? 'banner')
      const aspect = readOnly
        ? variant === 'square'
          ? 'aspect-square max-h-[9rem]'
          : variant === 'portrait'
            ? 'aspect-[3/4] max-h-[11rem]'
            : 'aspect-[21/9] max-h-[7rem]'
        : variant === 'square'
          ? 'aspect-square max-h-[14rem]'
          : variant === 'portrait'
            ? 'aspect-[3/4] max-h-[18rem]'
            : 'aspect-[21/9] max-h-[12rem]'
      return (
        <figure
          className={cn('relative mx-auto w-full max-w-4xl rounded-xl', readOnly && 'max-w-full', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {selected && !readOnly ? (
            <span className="absolute -top-2 left-0 z-10 rounded bg-[#2563eb] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Görsel
            </span>
          ) : null}
          <div className={cn('overflow-hidden rounded-lg border bg-muted shadow-sm', aspect)}>
            {src ? (
              <img src={src} alt={String(block.props.alt ?? '')} className="size-full object-cover" />
            ) : (
              <div className="flex size-full min-h-[6rem] items-center justify-center bg-gradient-to-br from-muted to-background text-xs text-muted-foreground">
                Görsel URL’si ekleyin
              </div>
            )}
          </div>
          {caption ? (
            <figcaption
              className={cn(
                'text-center text-muted-foreground',
                readOnly ? 'mt-1 text-[10px] leading-tight' : 'mt-2 text-xs',
              )}
            >
              {caption}
            </figcaption>
          ) : null}
        </figure>
      )
    }
    case 'marquee': {
      const items = (block.props.items as string[]) ?? []
      return (
        <div
          className={cn('relative overflow-hidden rounded-lg border bg-muted/40 py-2', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <div className="flex gap-8 whitespace-nowrap text-xs font-medium text-muted-foreground">
            {[...items, ...items].map((t, i) => (
              <span key={`${t}-${i}`}>{t}</span>
            ))}
          </div>
        </div>
      )
    }
    case 'numbers-band': {
      const items = (block.props.items as { n: string; l: string }[]) ?? []
      return (
        <div
          className={cn('grid grid-cols-3 gap-4 rounded-xl border bg-primary/10 px-6 py-6', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {items.map((it) => (
            <div key={it.l} className="text-center">
              <p className="text-2xl font-bold">{it.n}</p>
              <p className="text-xs text-muted-foreground">{it.l}</p>
            </div>
          ))}
        </div>
      )
    }
    case 'cta-split': {
      const left = String(block.props.left ?? '')
      const right = String(block.props.right ?? '')
      const button = String(block.props.button ?? '')
      return (
        <div
          className={cn(
            'relative flex flex-col items-center justify-between gap-4 rounded-xl border bg-card px-6 py-8 md:flex-row',
            ring,
          )}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <p className="text-lg font-semibold">{left}</p>
          <p className="text-sm text-muted-foreground">{right}</p>
          <span className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {button}
          </span>
        </div>
      )
    }
    case 'map-strip': {
      const title = String(block.props.title ?? '')
      const address = String(block.props.address ?? '')
      return (
        <div
          className={cn('relative flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{address}</p>
          </div>
          <div className="h-16 w-32 rounded-md bg-muted" />
        </div>
      )
    }
    case 'social-proof': {
      const line = String(block.props.line ?? '')
      return (
        <div
          className={cn('rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs', ring)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        >
          {line}
        </div>
      )
    }
    default:
      return (
        <div className="rounded border border-dashed p-4 text-sm text-muted-foreground">
          Bilinmeyen blok
        </div>
      )
  }
}
