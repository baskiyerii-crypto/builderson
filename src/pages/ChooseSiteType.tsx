import { useNavigate } from 'react-router-dom'
import { Building2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProject } from '@/context/ProjectContext'
import type { SiteType } from '@/types/project'

export function ChooseSiteType() {
  const nav = useNavigate()
  const { setSiteType, project } = useProject()

  const pick = (t: SiteType) => {
    setSiteType(t)
    nav('/setup/shell')
  }

  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <header className="border-b bg-background/80 px-6 py-4 backdrop-blur">
        <p className="text-sm text-muted-foreground">Kurulum sihirbazı · Adım 1 / 3</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Site türünü seçin</h1>
      </header>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-6 px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer transition hover:border-primary/40 hover:shadow-md">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <CardTitle>E-ticaret</CardTitle>
              <CardDescription>
                Ürün, koleksiyon ve sipariş odaklı yönetim paneli ile vitrin oluşturun.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => pick('ecommerce')}>
                Bu şablonla devam et
              </Button>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition hover:border-primary/40 hover:shadow-md">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <CardTitle>Kurumsal</CardTitle>
              <CardDescription>
                Sayfa ve içerik ağırlıklı yapı; iletişim ve vitrin odaklı panel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary" onClick={() => pick('corporate')}>
                Bu şablonla devam et
              </Button>
            </CardContent>
          </Card>
        </div>
        {project.siteType ? (
          <p className="text-center text-xs text-muted-foreground">
            Kayıtlı tercih: <span className="font-medium">{project.siteType}</span> — yeniden
            seçerek değiştirebilirsiniz.
          </p>
        ) : null}
      </main>
    </div>
  )
}
