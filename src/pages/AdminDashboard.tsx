import { Link, useNavigate } from 'react-router-dom'
import {
  Boxes,
  FileText,
  LayoutTemplate,
  Mail,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useProject } from '@/context/ProjectContext'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function AdminDashboard() {
  const nav = useNavigate()
  const { project, setRole, resetWizard } = useProject()
  const ecommerce = project.siteType === 'ecommerce'

  const navItems = ecommerce
    ? [
        { to: '#', label: 'Sayfalar', icon: FileText },
        { to: '#', label: 'Ürünler', icon: Package },
        { to: '#', label: 'Siparişler', icon: ShoppingCart },
        { to: '#', label: 'İletişim', icon: Mail },
        { to: '/builder', label: 'ThemeBuilder', icon: LayoutTemplate },
      ]
    : [
        { to: '#', label: 'Sayfalar', icon: FileText },
        { to: '#', label: 'İletişim', icon: Mail },
        { to: '#', label: 'Ekip', icon: Users },
        { to: '/builder', label: 'ThemeBuilder', icon: LayoutTemplate },
      ]

  return (
    <div className="flex min-h-svh bg-muted/30">
      <aside className="hidden w-56 shrink-0 border-r bg-sidebar py-4 text-sidebar-foreground md:block">
        <div className="px-3 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Yönetim
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator className="my-3" />
        <div className="px-3 text-xs text-muted-foreground">
          Aktif site:{' '}
          <span className="font-medium text-sidebar-foreground">
            {project.siteType === 'ecommerce' ? 'E-ticaret' : 'Kurumsal'}
          </span>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Dashboard</p>
              <h1 className="text-2xl font-semibold tracking-tight">Yönetici paneli</h1>
            </div>
            <Link to="/builder" className={cn(buttonVariants())}>
              Customize (Builder)
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Modüller</CardTitle>
              <CardDescription>
                ThemeBuilder eklentisi builder arayüzünü açar. Diğer modüller örnek menüdür.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-600/15 text-sm font-bold text-violet-700 dark:text-violet-300">
                    T
                  </div>
                  <div>
                    <p className="text-sm font-medium">ThemeBuilder</p>
                    <p className="text-xs text-muted-foreground">Sürükle-bırak tema düzenleyici</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  Aktif
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-600/15 text-sm font-bold text-sky-700">
                    C
                  </div>
                  <div>
                    <p className="text-sm font-medium">İçerik</p>
                    <p className="text-xs text-muted-foreground">Örnek modül</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">Core</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Boxes className="h-4 w-4" />
                Son yönetici simülasyonu
              </CardTitle>
              <CardDescription>
                Son yönetici girişinde builder’da yalnızca metin/görsel alanları ön yüzden
                düzenlenebilir; yapı değişiklikleri panelden yapılır.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Rol</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={project.role === 'owner' ? 'default' : 'outline'}
                    onClick={() => setRole('owner')}
                  >
                    Ajans / sahip
                  </Button>
                  <Button
                    size="sm"
                    variant={project.role === 'client' ? 'default' : 'outline'}
                    onClick={() => setRole('client')}
                  >
                    Son yönetici
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-destructive">Tehlikeli bölge</CardTitle>
              <CardDescription>Kurulum sihirbazını sıfırlar (localStorage temizlenir).</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => {
                  resetWizard()
                  nav('/')
                }}
              >
                Sihirbazı sıfırla
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
