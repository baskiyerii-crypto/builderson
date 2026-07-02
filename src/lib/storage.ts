import { createEmptyProject, type DevicePreview, type Project } from '@/types/project'

const STORAGE_KEY = 'builder-site-v1'

function normalizeDevice(raw: unknown): DevicePreview {
  if (raw === 'tablet') return 'tabletLandscape'
  if (
    raw === 'desktop' ||
    raw === 'tabletLandscape' ||
    raw === 'tabletPortrait' ||
    raw === 'mobile'
  ) {
    return raw
  }
  return 'desktop'
}

export function loadProject(): Project {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyProject()
    const data = JSON.parse(raw) as Partial<Project>
    if (data?.schemaVersion !== 1) return createEmptyProject()
    const device = normalizeDevice(data.device)
    return { ...createEmptyProject(), ...data, device }
  } catch {
    return createEmptyProject()
  }
}

export function saveProject(project: Project): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
}

export function clearProject(): void {
  localStorage.removeItem(STORAGE_KEY)
}
