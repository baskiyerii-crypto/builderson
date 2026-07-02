import { Link } from 'react-router-dom'
import { PagePreviewContent } from '@/components/builder/PagePreviewContent'
import { canvasMaxWidth } from '@/lib/device-frame'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useProject } from '@/context/ProjectContext'

export function PreviewPage() {
  const { project } = useProject()

  return (
    <div className="min-h-svh bg-zinc-100 text-foreground dark:bg-zinc-950">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-2.5 backdrop-blur-md">
        <p className="text-sm font-semibold">Önizleme</p>
        <Link to="/builder" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          Editöre dön
        </Link>
      </div>
      <div className="mx-auto max-w-full px-4 py-8">
        <div
          className="mx-auto rounded-xl border border-border/80 bg-background shadow-lg"
          style={{ maxWidth: canvasMaxWidth(project.device) }}
        >
          <div className="border-b bg-muted/40 px-4 py-2 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Yayın önizlemesi
          </div>
          <div className="p-6">
            <PagePreviewContent project={project} />
          </div>
        </div>
      </div>
    </div>
  )
}
