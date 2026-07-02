import { Link } from 'react-router-dom'
import {
  Code2,
  Download,
  Expand,
  Eye,
  EyeOff,
  Globe,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Monitor,
  Moon,
  Network,
  RectangleHorizontal,
  RectangleVertical,
  Redo2,
  Smartphone,
  Sun,
  Undo2,
} from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useProject } from '@/context/ProjectContext'
import type { ReactNode } from 'react'

const wixBlueBg = '#3899ec'

export function BuilderTopBar({
  onOpenNavigator,
  onFullPreview,
  onJson,
  onExport,
  onBrowserFullscreen,
  browserFullscreen = false,
}: {
  onOpenNavigator: () => void
  onFullPreview: () => void
  onJson: () => void
  onExport: () => void
  onBrowserFullscreen?: () => void
  browserFullscreen?: boolean
}) {
  const {
    project,
    setDevice,
    setPreviewChrome,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useProject()
  const { theme, toggle } = useTheme()

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-[#d3d8de] bg-white px-2 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:gap-3 sm:px-3">
      <div className="flex min-w-0 items-center gap-2">
        <div
          className="hidden size-8 shrink-0 items-center justify-center rounded-md font-bold text-white sm:flex"
          style={{ backgroundColor: wixBlueBg }}
          aria-hidden
        >
          E
        </div>
        <div className="hidden min-w-0 flex-col leading-tight sm:flex">
          <span className="truncate text-sm font-semibold text-slate-900">Editör</span>
          <span className="truncate text-[10px] text-slate-500">Site oluşturucu</span>
        </div>
        {project.siteType ? (
          <Badge
            variant="secondary"
            className="shrink-0 border-0 bg-slate-100 text-[10px] font-medium text-slate-700"
          >
            {project.siteType === 'ecommerce' ? 'E-ticaret' : 'Kurumsal'}
          </Badge>
        ) : null}
        <Separator orientation="vertical" className="hidden h-6 bg-[#e8eaed] sm:block" />
        <Link
          to="/"
          className="hidden text-[10px] font-medium text-slate-500 underline-offset-2 hover:text-[#116dff] hover:underline sm:inline"
        >
          Site tipi
        </Link>
        <Link
          to="/preview"
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'hidden h-8 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:inline-flex',
          )}
        >
          <Globe className="mr-1 size-4 text-[#116dff]" />
          Önizle
        </Link>
        <Link
          to="/admin"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
          )}
        >
          <LayoutGrid className="size-4" />
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center gap-0.5 rounded-full border border-[#e8eaed] bg-[#f7f8fa] px-0.5 py-0.5 sm:px-1">
        <DeviceBtn active={project.device === 'desktop'} onClick={() => setDevice('desktop')} label="Masaüstü">
          <Monitor className="size-4" />
        </DeviceBtn>
        <DeviceBtn
          active={project.device === 'tabletLandscape'}
          onClick={() => setDevice('tabletLandscape')}
          label="Tablet yatay"
        >
          <RectangleHorizontal className="size-4" />
        </DeviceBtn>
        <DeviceBtn
          active={project.device === 'tabletPortrait'}
          onClick={() => setDevice('tabletPortrait')}
          label="Tablet dikey"
        >
          <RectangleVertical className="size-4" />
        </DeviceBtn>
        <DeviceBtn active={project.device === 'mobile'} onClick={() => setDevice('mobile')} label="Mobil">
          <Smartphone className="size-4" />
        </DeviceBtn>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <span className="hidden rounded border border-[#e8eaed] bg-white px-2 py-0.5 font-mono text-[10px] text-slate-500 lg:inline">
          100%
        </span>
        <Tooltip>
          <TooltipTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:bg-slate-100"
              onClick={onOpenNavigator}
            >
              <Network className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Gezgin (katmanlar)</TooltipContent>
        </Tooltip>
        {onBrowserFullscreen ? (
          <Tooltip>
            <TooltipTrigger>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-slate-600 hover:bg-slate-100"
                onClick={onBrowserFullscreen}
              >
                {browserFullscreen ? (
                  <Minimize2 className="size-4" />
                ) : (
                  <Expand className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {browserFullscreen ? 'Tam ekrandan çık' : 'Tarayıcıda tam ekran'}
            </TooltipContent>
          </Tooltip>
        ) : null}
        <Tooltip>
          <TooltipTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:bg-slate-100"
              onClick={onFullPreview}
            >
              <Maximize2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tam ekran önizleme</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:bg-slate-100"
              onClick={() => setPreviewChrome(!project.previewChrome)}
            >
              {project.previewChrome ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Önizleme kromu</TooltipContent>
        </Tooltip>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-slate-600 hover:bg-slate-100"
          disabled={!canUndo}
          onClick={undo}
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-slate-600 hover:bg-slate-100"
          disabled={!canRedo}
          onClick={redo}
        >
          <Redo2 className="size-4" />
        </Button>
        <Tooltip>
          <TooltipTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:bg-slate-100"
              onClick={onJson}
            >
              <Code2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>JSON</TooltipContent>
        </Tooltip>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-slate-600 hover:bg-slate-100"
          onClick={onExport}
        >
          <Download className="size-4" />
        </Button>
        <Tooltip>
          <TooltipTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:bg-slate-100"
              onClick={toggle}
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tema</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-0.5 hidden h-6 bg-[#e8eaed] sm:block" />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="hidden h-8 border-[#c9ced6] bg-white text-xs text-slate-700 hover:bg-slate-50 sm:inline-flex"
          onClick={() => {
            void 0
          }}
        >
          Kaydet
        </Button>
        <Button
          type="button"
          size="sm"
          className="hidden h-8 px-4 text-xs font-semibold text-white shadow-sm sm:inline-flex"
          style={{ backgroundColor: wixBlueBg }}
        >
          Yayınla
        </Button>
      </div>
    </header>
  )
}

function DeviceBtn({
  children,
  active,
  onClick,
  label,
}: {
  children: ReactNode
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={cn(
            'size-8 rounded-full sm:size-9',
            active
              ? 'bg-white text-[#116dff] shadow-sm ring-1 ring-[#3899ec]/35'
              : 'text-slate-500 hover:bg-white/80 hover:text-slate-800',
          )}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}
