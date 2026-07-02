import { arrayMove } from '@dnd-kit/sortable'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import {
  getRowColumns,
  regenerateIdsDeep,
  removeBlockDeep,
  setRowColumns,
  updateBlockLayoutDeep,
  updateBlockPropsDeep,
} from '@/lib/block-tree'
import { newId } from '@/lib/id'
import { loadProject, saveProject } from '@/lib/storage'
import { canPlaceBlock, mergeBlockProps } from '@/lib/templates'
import {
  createEmptyProject,
  type BlockInstance,
  type BlockLayoutStyle,
  type BlockType,
  type CanvasZone,
  type DevicePreview,
  type Project,
  type SiteType,
  type UserRole,
} from '@/types/project'

export type Selection = { zone: CanvasZone; id: string } | null

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

function blocksOf(project: Project, zone: CanvasZone): BlockInstance[] {
  if (zone === 'header') return project.headerBlocks
  if (zone === 'footer') return project.footerBlocks
  return project.bodyBlocks
}

function setBlocks(
  project: Project,
  zone: CanvasZone,
  blocks: BlockInstance[],
): Project {
  if (zone === 'header') return { ...project, headerBlocks: blocks }
  if (zone === 'footer') return { ...project, footerBlocks: blocks }
  return { ...project, bodyBlocks: blocks }
}

function patchRowInList(
  blocks: BlockInstance[],
  rowId: string,
  patch: (c0: BlockInstance[], c1: BlockInstance[]) => [BlockInstance[], BlockInstance[]],
): BlockInstance[] {
  return blocks.map((b) => {
    if (b.id !== rowId || b.type !== 'row-2') return b
    const [c0, c1] = getRowColumns(b)
    const [n0, n1] = patch(c0, c1)
    return setRowColumns(b, n0, n1)
  })
}

type EditorState = {
  project: Project
  past: Project[]
  future: Project[]
  selection: Selection
}

type Action =
  | { type: 'HYDRATE'; project: Project }
  | { type: 'SET_SITE_TYPE'; siteType: SiteType }
  | {
      type: 'SET_SHELL'
      headerTemplateId: string
      footerTemplateId: string
      headerBlocks: BlockInstance[]
      footerBlocks: BlockInstance[]
    }
  | {
      type: 'ADD_BLOCK'
      zone: CanvasZone
      blockType: BlockType
      atIndex?: number
      selectAfter?: boolean
      presetOverrides?: Record<string, unknown>
    }
  | {
      type: 'ADD_BLOCK_NESTED'
      zone: CanvasZone
      rowId: string
      column: 0 | 1
      blockType: BlockType
      atIndex?: number
      selectAfter?: boolean
      presetOverrides?: Record<string, unknown>
    }
  | {
      type: 'UPDATE_BLOCK_PROPS'
      zone: CanvasZone
      id: string
      props: Record<string, unknown>
    }
  | {
      type: 'UPDATE_BLOCK_LAYOUT'
      zone: CanvasZone
      id: string
      layout: Partial<BlockLayoutStyle>
    }
  | { type: 'APPLY_BODY_THEME'; blocks: BlockInstance[] }
  | { type: 'DUPLICATE_BLOCK'; zone: CanvasZone; id: string }
  | { type: 'REMOVE_BLOCK'; zone: CanvasZone; id: string }
  | { type: 'MOVE_BLOCK'; zone: CanvasZone; from: number; to: number }
  | {
      type: 'MOVE_BLOCK_NESTED'
      zone: CanvasZone
      rowId: string
      column: 0 | 1
      from: number
      to: number
    }
  | {
      type: 'MOVE_BLOCK_NESTED_CROSS'
      zone: CanvasZone
      rowId: string
      fromCol: 0 | 1
      toCol: 0 | 1
      fromIdx: number
      toIdx: number
    }
  | {
      type: 'MOVE_ROOT_INTO_NESTED'
      zone: CanvasZone
      fromRootIndex: number
      rowId: string
      column: 0 | 1
      atIndex?: number
    }
  | {
      type: 'MOVE_NESTED_TO_ROOT'
      zone: CanvasZone
      fromRowId: string
      fromColumn: 0 | 1
      fromIdx: number
      toRootIndex?: number
    }
  | {
      type: 'MOVE_NESTED_TO_OTHER_ROW'
      zone: CanvasZone
      fromRowId: string
      fromColumn: 0 | 1
      fromIdx: number
      toRowId: string
      toColumn: 0 | 1
      toIdx: number
    }
  | { type: 'SET_DEVICE'; device: DevicePreview }
  | { type: 'SET_PREVIEW_CHROME'; previewChrome: boolean }
  | { type: 'SET_ROLE'; role: UserRole }
  | { type: 'SELECT'; selection: Selection }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_WIZARD' }

function recordPast(s: EditorState): Project[] {
  return [...s.past.slice(-49), clone(s.project)]
}

function reducer(s: EditorState, a: Action): EditorState {
  switch (a.type) {
    case 'HYDRATE':
      return { ...s, project: a.project, past: [], future: [] }
    case 'SET_SITE_TYPE': {
      const project = { ...s.project, siteType: a.siteType }
      saveProject(project)
      return { ...s, project }
    }
    case 'SET_SHELL': {
      const project: Project = {
        ...s.project,
        headerTemplateId: a.headerTemplateId,
        footerTemplateId: a.footerTemplateId,
        headerBlocks: a.headerBlocks,
        footerBlocks: a.footerBlocks,
      }
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
      }
    }
    case 'ADD_BLOCK': {
      if (!canPlaceBlock(a.blockType, a.zone)) return s
      const block: BlockInstance = {
        id: newId(),
        type: a.blockType,
        props: mergeBlockProps(a.blockType, s.project.siteType, a.presetOverrides),
      }
      const list = [...blocksOf(s.project, a.zone)]
      const idx =
        a.atIndex === undefined
          ? list.length
          : Math.max(0, Math.min(list.length, a.atIndex))
      list.splice(idx, 0, block)
      const project = setBlocks(s.project, a.zone, list)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
        selection: a.selectAfter ? { zone: a.zone, id: block.id } : s.selection,
      }
    }
    case 'ADD_BLOCK_NESTED': {
      if (a.zone !== 'body') return s
      if (a.blockType === 'row-2') return s
      if (!canPlaceBlock(a.blockType, a.zone)) return s
      const inner: BlockInstance = {
        id: newId(),
        type: a.blockType,
        props: mergeBlockProps(a.blockType, s.project.siteType, a.presetOverrides),
      }
      const list = [...blocksOf(s.project, a.zone)]
      const newList = patchRowInList(list, a.rowId, (c0, c1) => {
        const col = a.column === 0 ? [...c0] : [...c1]
        const ix =
          a.atIndex === undefined
            ? col.length
            : Math.max(0, Math.min(col.length, a.atIndex))
        col.splice(ix, 0, inner)
        return a.column === 0 ? [col, c1] : [c0, col]
      })
      const project = setBlocks(s.project, a.zone, newList)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
        selection: a.selectAfter ? { zone: a.zone, id: inner.id } : s.selection,
      }
    }
    case 'UPDATE_BLOCK_PROPS': {
      const list = updateBlockPropsDeep(blocksOf(s.project, a.zone), a.id, a.props)
      const project = setBlocks(s.project, a.zone, list)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
      }
    }
    case 'UPDATE_BLOCK_LAYOUT': {
      const list = updateBlockLayoutDeep(blocksOf(s.project, a.zone), a.id, a.layout)
      const project = setBlocks(s.project, a.zone, list)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
      }
    }
    case 'APPLY_BODY_THEME': {
      const project = { ...s.project, bodyBlocks: a.blocks }
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
        selection: null,
      }
    }
    case 'DUPLICATE_BLOCK': {
      const list = [...blocksOf(s.project, a.zone)]
      const idx = list.findIndex((b) => b.id === a.id)
      if (idx < 0) return s
      const orig = list[idx]
      const copy = regenerateIdsDeep(clone(orig))
      list.splice(idx + 1, 0, copy)
      const project = setBlocks(s.project, a.zone, list)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
        selection: { zone: a.zone, id: copy.id },
      }
    }
    case 'REMOVE_BLOCK': {
      const list = removeBlockDeep(blocksOf(s.project, a.zone), a.id)
      const project = setBlocks(s.project, a.zone, list)
      saveProject(project)
      const selection = s.selection?.id === a.id ? null : s.selection
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
        selection,
      }
    }
    case 'MOVE_BLOCK': {
      const list = [...blocksOf(s.project, a.zone)]
      if (
        a.from === a.to ||
        a.from < 0 ||
        a.to < 0 ||
        a.from >= list.length ||
        a.to >= list.length
      ) {
        return s
      }
      const next = arrayMove(list, a.from, a.to)
      const project = setBlocks(s.project, a.zone, next)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
      }
    }
    case 'MOVE_BLOCK_NESTED': {
      if (a.zone !== 'body') return s
      const list = patchRowInList(blocksOf(s.project, a.zone), a.rowId, (c0, c1) => {
        const col = a.column === 0 ? [...c0] : [...c1]
        if (
          a.from === a.to ||
          a.from < 0 ||
          a.to < 0 ||
          a.from >= col.length ||
          a.to >= col.length
        ) {
          return [c0, c1]
        }
        const next = arrayMove(col, a.from, a.to)
        return a.column === 0 ? [next, c1] : [c0, next]
      })
      const project = setBlocks(s.project, a.zone, list)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
      }
    }
    case 'MOVE_BLOCK_NESTED_CROSS': {
      if (a.zone !== 'body') return s
      const list = patchRowInList(blocksOf(s.project, a.zone), a.rowId, (c0, c1) => {
        const left = [...c0]
        const right = [...c1]
        const fromArr = a.fromCol === 0 ? left : right
        const toArr = a.toCol === 0 ? left : right
        if (a.fromIdx < 0 || a.fromIdx >= fromArr.length) return [c0, c1]
        const [moved] = fromArr.splice(a.fromIdx, 1)
        const toIdx = Math.max(0, Math.min(toArr.length, a.toIdx))
        toArr.splice(toIdx, 0, moved)
        return [left, right]
      })
      const project = setBlocks(s.project, a.zone, list)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
      }
    }
    case 'MOVE_ROOT_INTO_NESTED': {
      if (a.zone !== 'body') return s
      const list = [...blocksOf(s.project, 'body')]
      const row = list.find((b) => b.id === a.rowId && b.type === 'row-2')
      if (!row) return s
      if (a.fromRootIndex < 0 || a.fromRootIndex >= list.length) return s
      const moved = list[a.fromRootIndex]
      if (!moved || moved.type === 'row-2' || moved.id === a.rowId) return s
      list.splice(a.fromRootIndex, 1)
      const newList = patchRowInList(list, a.rowId, (c0, c1) => {
        const col = a.column === 0 ? [...c0] : [...c1]
        const ix =
          a.atIndex === undefined
            ? col.length
            : Math.max(0, Math.min(col.length, a.atIndex))
        col.splice(ix, 0, moved)
        return a.column === 0 ? [col, c1] : [c0, col]
      })
      const project = setBlocks(s.project, 'body', newList)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
      }
    }
    case 'MOVE_NESTED_TO_ROOT': {
      if (a.zone !== 'body') return s
      let extracted: BlockInstance | undefined
      const list = [...blocksOf(s.project, 'body')]
      const afterExtract = patchRowInList(list, a.fromRowId, (c0, c1) => {
        const col = a.fromColumn === 0 ? [...c0] : [...c1]
        if (a.fromIdx < 0 || a.fromIdx >= col.length) return [c0, c1]
        extracted = col[a.fromIdx]
        col.splice(a.fromIdx, 1)
        return a.fromColumn === 0 ? [col, c1] : [c0, col]
      })
      if (!extracted) return s
      const ix =
        a.toRootIndex === undefined
          ? afterExtract.length
          : Math.max(0, Math.min(afterExtract.length, a.toRootIndex))
      afterExtract.splice(ix, 0, extracted)
      const project = setBlocks(s.project, 'body', afterExtract)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
      }
    }
    case 'MOVE_NESTED_TO_OTHER_ROW': {
      if (a.zone !== 'body') return s
      if (a.fromRowId === a.toRowId) return s
      let extracted: BlockInstance | undefined
      const list = [...blocksOf(s.project, 'body')]
      const afterExtract = patchRowInList(list, a.fromRowId, (c0, c1) => {
        const col = a.fromColumn === 0 ? [...c0] : [...c1]
        if (a.fromIdx < 0 || a.fromIdx >= col.length) return [c0, c1]
        extracted = col[a.fromIdx]
        col.splice(a.fromIdx, 1)
        return a.fromColumn === 0 ? [col, c1] : [c0, col]
      })
      if (!extracted || extracted.type === 'row-2') return s
      if (extracted.id === a.toRowId) return s
      const targetRow = afterExtract.find((b) => b.id === a.toRowId && b.type === 'row-2')
      if (!targetRow) return s
      const afterInsert = patchRowInList(afterExtract, a.toRowId, (c0, c1) => {
        const col = a.toColumn === 0 ? [...c0] : [...c1]
        const ix = Math.max(0, Math.min(col.length, a.toIdx))
        col.splice(ix, 0, extracted!)
        return a.toColumn === 0 ? [col, c1] : [c0, col]
      })
      const project = setBlocks(s.project, 'body', afterInsert)
      saveProject(project)
      return {
        ...s,
        past: recordPast(s),
        future: [],
        project,
      }
    }
    case 'SET_DEVICE': {
      const project = { ...s.project, device: a.device }
      saveProject(project)
      return { ...s, project }
    }
    case 'SET_PREVIEW_CHROME': {
      const project = { ...s.project, previewChrome: a.previewChrome }
      saveProject(project)
      return { ...s, project }
    }
    case 'SET_ROLE': {
      const project = { ...s.project, role: a.role }
      saveProject(project)
      return { ...s, project }
    }
    case 'SELECT':
      return { ...s, selection: a.selection }
    case 'UNDO': {
      const prev = s.past[s.past.length - 1]
      if (!prev) return s
      const past = s.past.slice(0, -1)
      const future = [clone(s.project), ...s.future]
      saveProject(prev)
      return { ...s, project: prev, past, future, selection: null }
    }
    case 'REDO': {
      const next = s.future[0]
      if (!next) return s
      const future = s.future.slice(1)
      const past = [...s.past, clone(s.project)]
      saveProject(next)
      return { ...s, project: next, past, future, selection: null }
    }
    case 'RESET_WIZARD': {
      const project = createEmptyProject()
      saveProject(project)
      return { ...s, project, past: [], future: [], selection: null }
    }
    default:
      return s
  }
}

type Ctx = {
  project: Project
  selection: Selection
  setSelection: (sel: Selection) => void
  setSiteType: (t: SiteType) => void
  setShell: (input: {
    headerTemplateId: string
    footerTemplateId: string
    headerBlocks: BlockInstance[]
    footerBlocks: BlockInstance[]
  }) => void
  addBlock: (
    zone: CanvasZone,
    type: BlockType,
    atIndex?: number,
    selectAfter?: boolean,
    presetOverrides?: Record<string, unknown>,
  ) => void
  addBlockNested: (
    zone: CanvasZone,
    rowId: string,
    column: 0 | 1,
    type: BlockType,
    atIndex?: number,
    selectAfter?: boolean,
    presetOverrides?: Record<string, unknown>,
  ) => void
  updateBlockProps: (
    zone: CanvasZone,
    id: string,
    props: Record<string, unknown>,
  ) => void
  updateBlockLayout: (
    zone: CanvasZone,
    id: string,
    layout: Partial<BlockLayoutStyle>,
  ) => void
  applyBodyTheme: (blocks: BlockInstance[]) => void
  duplicateBlock: (zone: CanvasZone, id: string) => void
  removeBlock: (zone: CanvasZone, id: string) => void
  moveBlock: (zone: CanvasZone, from: number, to: number) => void
  moveBlockNested: (
    zone: CanvasZone,
    rowId: string,
    column: 0 | 1,
    from: number,
    to: number,
  ) => void
  moveBlockNestedCross: (
    zone: CanvasZone,
    rowId: string,
    fromCol: 0 | 1,
    toCol: 0 | 1,
    fromIdx: number,
    toIdx: number,
  ) => void
  moveRootIntoNested: (
    zone: CanvasZone,
    fromRootIndex: number,
    rowId: string,
    column: 0 | 1,
    atIndex?: number,
  ) => void
  moveNestedToRoot: (
    zone: CanvasZone,
    fromRowId: string,
    fromColumn: 0 | 1,
    fromIdx: number,
    toRootIndex?: number,
  ) => void
  moveNestedToOtherRow: (
    zone: CanvasZone,
    fromRowId: string,
    fromColumn: 0 | 1,
    fromIdx: number,
    toRowId: string,
    toColumn: 0 | 1,
    toIdx: number,
  ) => void
  setDevice: (d: DevicePreview) => void
  setPreviewChrome: (v: boolean) => void
  setRole: (r: UserRole) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  resetWizard: () => void
}

const ProjectContext = createContext<Ctx | null>(null)

const initial: EditorState = {
  project: loadProject(),
  past: [],
  future: [],
  selection: null,
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)

  const setSelection = useCallback((selection: Selection) => {
    dispatch({ type: 'SELECT', selection })
  }, [])

  const value = useMemo<Ctx>(
    () => ({
      project: state.project,
      selection: state.selection,
      setSelection,
      setSiteType: (siteType) => dispatch({ type: 'SET_SITE_TYPE', siteType }),
      setShell: (input) => dispatch({ type: 'SET_SHELL', ...input }),
      addBlock: (zone, blockType, atIndex, selectAfter, presetOverrides) =>
        dispatch({ type: 'ADD_BLOCK', zone, blockType, atIndex, selectAfter, presetOverrides }),
      addBlockNested: (zone, rowId, column, blockType, atIndex, selectAfter, presetOverrides) =>
        dispatch({
          type: 'ADD_BLOCK_NESTED',
          zone,
          rowId,
          column,
          blockType,
          atIndex,
          selectAfter,
          presetOverrides,
        }),
      updateBlockProps: (zone, id, props) =>
        dispatch({ type: 'UPDATE_BLOCK_PROPS', zone, id, props }),
      updateBlockLayout: (zone, id, layout) =>
        dispatch({ type: 'UPDATE_BLOCK_LAYOUT', zone, id, layout }),
      applyBodyTheme: (blocks) => dispatch({ type: 'APPLY_BODY_THEME', blocks }),
      duplicateBlock: (zone, id) => dispatch({ type: 'DUPLICATE_BLOCK', zone, id }),
      removeBlock: (zone, id) => dispatch({ type: 'REMOVE_BLOCK', zone, id }),
      moveBlock: (zone, from, to) => dispatch({ type: 'MOVE_BLOCK', zone, from, to }),
      moveBlockNested: (zone, rowId, column, from, to) =>
        dispatch({ type: 'MOVE_BLOCK_NESTED', zone, rowId, column, from, to }),
      moveBlockNestedCross: (zone, rowId, fromCol, toCol, fromIdx, toIdx) =>
        dispatch({
          type: 'MOVE_BLOCK_NESTED_CROSS',
          zone,
          rowId,
          fromCol,
          toCol,
          fromIdx,
          toIdx,
        }),
      moveRootIntoNested: (zone, fromRootIndex, rowId, column, atIndex) =>
        dispatch({
          type: 'MOVE_ROOT_INTO_NESTED',
          zone,
          fromRootIndex,
          rowId,
          column,
          atIndex,
        }),
      moveNestedToRoot: (zone, fromRowId, fromColumn, fromIdx, toRootIndex) =>
        dispatch({
          type: 'MOVE_NESTED_TO_ROOT',
          zone,
          fromRowId,
          fromColumn,
          fromIdx,
          toRootIndex,
        }),
      moveNestedToOtherRow: (
        zone,
        fromRowId,
        fromColumn,
        fromIdx,
        toRowId,
        toColumn,
        toIdx,
      ) =>
        dispatch({
          type: 'MOVE_NESTED_TO_OTHER_ROW',
          zone,
          fromRowId,
          fromColumn,
          fromIdx,
          toRowId,
          toColumn,
          toIdx,
        }),
      setDevice: (device) => dispatch({ type: 'SET_DEVICE', device }),
      setPreviewChrome: (previewChrome) =>
        dispatch({ type: 'SET_PREVIEW_CHROME', previewChrome }),
      setRole: (role) => dispatch({ type: 'SET_ROLE', role }),
      undo: () => dispatch({ type: 'UNDO' }),
      redo: () => dispatch({ type: 'REDO' }),
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      resetWizard: () => dispatch({ type: 'RESET_WIZARD' }),
    }),
    [state, setSelection],
  )

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  )
}

export function useProject() {
  const v = useContext(ProjectContext)
  if (!v) throw new Error('useProject must be used within ProjectProvider')
  return v
}
