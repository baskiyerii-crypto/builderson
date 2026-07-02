import { BlockViews } from '@/blocks/BlockViews'
import type { Project } from '@/types/project'
import { cn } from '@/lib/utils'

export function PagePreviewContent({
  project,
  className,
}: {
  project: Project
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-6 text-foreground', className)}>
      {project.headerBlocks.map((b) => (
        <BlockViews
          key={b.id}
          block={b}
          selected={false}
          onSelect={() => {}}
          inlineEdit={false}
          readOnly
        />
      ))}
      <div className="flex flex-col gap-6">
        {project.bodyBlocks.map((b) => (
          <BlockViews
            key={b.id}
            block={b}
            selected={false}
            onSelect={() => {}}
            inlineEdit={false}
            readOnly
          />
        ))}
      </div>
      {project.footerBlocks.map((b) => (
        <BlockViews
          key={b.id}
          block={b}
          selected={false}
          onSelect={() => {}}
          inlineEdit={false}
          readOnly
        />
      ))}
    </div>
  )
}
