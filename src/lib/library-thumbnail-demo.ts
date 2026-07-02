import { getRowColumns } from '@/lib/block-tree'
import { demoPic } from '@/lib/demo-assets'
import type { BlockInstance } from '@/types/project'

/**
 * Kütüphane / + menüsü / sürükleme önizlemesi için: boş `row-2` satırına
 * geçici demo çocuk blokları ekler (canvas’a eklemede kullanılmaz).
 */
export function withLibraryThumbnailChildren(block: BlockInstance, seed: string): BlockInstance {
  if (block.type !== 'row-2') return block
  const [c0, c1] = getRowColumns(block)
  if (c0.length > 0 || c1.length > 0) return block

  const col0: BlockInstance[] = [
    {
      id: `${seed}-thumb-c0a`,
      type: 'heading',
      props: { text: 'Sol sütun', level: 3, align: 'left' },
    },
    {
      id: `${seed}-thumb-c0b`,
      type: 'text',
      props: {
        text: 'Başlık + metin + görsel ile dolu bir satır önizlemesi.',
      },
    },
  ]
  const col1: BlockInstance[] = [
    {
      id: `${seed}-thumb-c1a`,
      type: 'photo',
      props: {
        imageUrl: demoPic(`${seed}-thumb-ph`, 560, 560),
        alt: '',
        caption: 'Örnek görsel',
        variant: 'square',
      },
    },
  ]

  return {
    ...block,
    props: {
      ...block.props,
      col0,
      col1,
    },
  }
}
