import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProject } from '@/context/ProjectContext'
import {
  footerTemplatePresets,
  headerTemplatePresets,
  instantiateTemplate,
} from '@/lib/templates'

const HEADER_OPTIONS = [
  { id: 'minimal', name: 'Minimal', desc: 'Sade logo ve menü' },
  { id: 'commerce', name: 'Mağaza', desc: 'Sepet vurgulu üst bar' },
  { id: 'bold', name: 'Bold', desc: 'Merkez başlık + menü' },
] as const

const FOOTER_OPTIONS = [
  { id: 'simple', name: 'Kurumsal footer', desc: 'İki sütun + not' },
  { id: 'ecommerce', name: 'E-ticaret footer', desc: 'Alışveriş ve hesap linkleri' },
] as const

export function SetupShell() {
  const nav = useNavigate()
  const { project, setShell } = useProject()

  const defaultHeader = project.siteType === 'ecommerce' ? 'commerce' : 'minimal'
  const defaultFooter = project.siteType === 'ecommerce' ? 'ecommerce' : 'simple'
  const [h, setH] = useState(project.headerTemplateId ?? defaultHeader)
  const [f, setF] = useState(project.footerTemplateId ?? defaultFooter)

  useEffect(() => {
    if (!project.siteType) nav('/')
  }, [project.siteType, nav])

  const continueToBuilder = () => {
    const headerBlocks = instantiateTemplate(headerTemplatePresets, h)
    const footerBlocks = instantiateTemplate(footerTemplatePresets, f)
    setShell({
      headerTemplateId: h,
      footerTemplateId: f,
      headerBlocks,
      footerBlocks,
    })
    nav('/builder')
  }

  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <header className="border-b bg-background/80 px-6 py-4 backdrop-blur">
        <p className="text-sm text-muted-foreground">Kurulum sihirbazı · Adım 2 / 3</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Üst ve alt çerçeve</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Header ve footer tüm sayfalarda sabit kalır; builder içinde yine düzenleyebilirsiniz.
        </p>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-10 px-4 py-10">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Header şablonu
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {HEADER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setH(opt.id)}
                className={`rounded-xl border bg-card p-4 text-left transition hover:border-primary/40 ${
                  h === opt.id ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{opt.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  {h === opt.id ? (
                    <span className="rounded-full bg-primary/15 p-1 text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 h-14 rounded-md border bg-gradient-to-r from-muted to-background" />
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Footer şablonu
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {FOOTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setF(opt.id)}
                className={`rounded-xl border bg-card p-4 text-left transition hover:border-primary/40 ${
                  f === opt.id ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{opt.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  {f === opt.id ? (
                    <span className="rounded-full bg-primary/15 p-1 text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 h-12 rounded-md border bg-gradient-to-r from-muted to-background" />
              </button>
            ))}
          </div>
        </section>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Özet</CardTitle>
            <CardDescription>
              Seçilen kabuk builder’da blok olarak yüklenir; sürükleyip sıralayabilirsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => nav('/')}>
              Geri
            </Button>
            <Button onClick={continueToBuilder}>Builder’a geç</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
