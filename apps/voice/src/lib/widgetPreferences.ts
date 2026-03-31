export const WIDGET_OPACITY_KEY = 'sloervoice_widget_opacity'
export const WIDGET_ALWAYS_TOP_KEY = 'sloervoice_widget_always_top'
export const WIDGET_COMPACT_KEY = 'sloervoice_widget_compact'
export const APP_THEME_KEY = 'sloervoice_theme'
export const WIDGET_POSITION_X_KEY = 'sloervoice_widget_position_x'
export const WIDGET_POSITION_Y_KEY = 'sloervoice_widget_position_y'
export const WIDGET_POSITION_RESET_KEY = 'sloervoice_widget_position_reset_at'

export const DEFAULT_WIDGET_OPACITY = 1
export const DEFAULT_WIDGET_ALWAYS_ON_TOP = true
export const DEFAULT_WIDGET_COMPACT = false
export const DEFAULT_APP_THEME = 'void'

const MIN_WIDGET_OPACITY = 0.7
const MAX_WIDGET_OPACITY = 1
const WIDGET_OPACITY_STEP = 0.05

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export type WidgetPosition = {
  x: number
  y: number
}

const getStorage = (storage?: StorageLike) => storage ?? window.localStorage

const roundOpacity = (value: number) => Math.round(value * 100) / 100
const roundWidgetCoordinate = (value: number) => Math.round(value)

const parseWidgetCoordinate = (value: string | null) => {
  const parsed = Number.parseFloat(value ?? '')
  return Number.isFinite(parsed) ? roundWidgetCoordinate(parsed) : null
}

export const clampWidgetOpacity = (value: number) => roundOpacity(Math.min(MAX_WIDGET_OPACITY, Math.max(MIN_WIDGET_OPACITY, value)))

export const getWidgetOpacity = (storage?: StorageLike) => {
  const raw = Number.parseFloat(getStorage(storage).getItem(WIDGET_OPACITY_KEY) ?? `${DEFAULT_WIDGET_OPACITY}`)
  return Number.isFinite(raw) ? clampWidgetOpacity(raw) : DEFAULT_WIDGET_OPACITY
}

export const dispatchWidgetStorageEvent = (key: string, newValue: string | null) => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea: window.localStorage }))
}

export const setWidgetOpacity = (value: number, storage?: StorageLike) => {
  const nextValue = clampWidgetOpacity(value)
  getStorage(storage).setItem(WIDGET_OPACITY_KEY, `${nextValue.toFixed(2)}`)
  dispatchWidgetStorageEvent(WIDGET_OPACITY_KEY, `${nextValue.toFixed(2)}`)
  return nextValue
}

export const increaseWidgetOpacity = (step = WIDGET_OPACITY_STEP, storage?: StorageLike) => {
  return setWidgetOpacity(getWidgetOpacity(storage) + step, storage)
}

export const decreaseWidgetOpacity = (step = WIDGET_OPACITY_STEP, storage?: StorageLike) => {
  return setWidgetOpacity(getWidgetOpacity(storage) - step, storage)
}

export const getWidgetAlwaysOnTop = (storage?: StorageLike) => {
  const stored = getStorage(storage).getItem(WIDGET_ALWAYS_TOP_KEY)
  if (stored === null) {
    return DEFAULT_WIDGET_ALWAYS_ON_TOP
  }

  return stored !== 'false'
}

export const setWidgetAlwaysOnTop = (value: boolean, storage?: StorageLike) => {
  const nextValue = value.toString()
  getStorage(storage).setItem(WIDGET_ALWAYS_TOP_KEY, nextValue)
  dispatchWidgetStorageEvent(WIDGET_ALWAYS_TOP_KEY, nextValue)
  return value
}

export const toggleWidgetAlwaysOnTop = (storage?: StorageLike) => {
  return setWidgetAlwaysOnTop(!getWidgetAlwaysOnTop(storage), storage)
}

export const getWidgetCompactMode = (storage?: StorageLike) => {
  return getStorage(storage).getItem(WIDGET_COMPACT_KEY) === 'true'
}

export const setWidgetCompactMode = (value: boolean, storage?: StorageLike) => {
  const nextValue = value.toString()
  getStorage(storage).setItem(WIDGET_COMPACT_KEY, nextValue)
  dispatchWidgetStorageEvent(WIDGET_COMPACT_KEY, nextValue)
  return value
}

export const toggleWidgetCompactMode = (storage?: StorageLike) => {
  return setWidgetCompactMode(!getWidgetCompactMode(storage), storage)
}

export const getWidgetPosition = (storage?: StorageLike) => {
  const targetStorage = getStorage(storage)
  const x = parseWidgetCoordinate(targetStorage.getItem(WIDGET_POSITION_X_KEY))
  const y = parseWidgetCoordinate(targetStorage.getItem(WIDGET_POSITION_Y_KEY))

  if (x === null || y === null) {
    return null
  }

  return { x, y }
}

export const setWidgetPosition = (value: WidgetPosition, storage?: StorageLike) => {
  const targetStorage = getStorage(storage)
  const nextValue = {
    x: roundWidgetCoordinate(value.x),
    y: roundWidgetCoordinate(value.y),
  }

  targetStorage.setItem(WIDGET_POSITION_X_KEY, `${nextValue.x}`)
  targetStorage.setItem(WIDGET_POSITION_Y_KEY, `${nextValue.y}`)
  dispatchWidgetStorageEvent(WIDGET_POSITION_X_KEY, `${nextValue.x}`)
  dispatchWidgetStorageEvent(WIDGET_POSITION_Y_KEY, `${nextValue.y}`)

  return nextValue
}

export const clearWidgetPosition = (storage?: StorageLike) => {
  const targetStorage = getStorage(storage)
  targetStorage.removeItem(WIDGET_POSITION_X_KEY)
  targetStorage.removeItem(WIDGET_POSITION_Y_KEY)
  dispatchWidgetStorageEvent(WIDGET_POSITION_X_KEY, null)
  dispatchWidgetStorageEvent(WIDGET_POSITION_Y_KEY, null)
  return null
}

export const resetWidgetPosition = (storage?: StorageLike) => {
  const targetStorage = getStorage(storage)
  clearWidgetPosition(targetStorage)
  const token = `${Date.now()}`
  targetStorage.setItem(WIDGET_POSITION_RESET_KEY, token)
  dispatchWidgetStorageEvent(WIDGET_POSITION_RESET_KEY, token)
  return token
}

export const getStoredTheme = (storage?: StorageLike) => {
  return getStorage(storage).getItem(APP_THEME_KEY) ?? DEFAULT_APP_THEME
}

export const setStoredTheme = (value: string, storage?: StorageLike) => {
  getStorage(storage).setItem(APP_THEME_KEY, value)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sloervoice_theme_changed', { detail: value }))
  }
  return value
}

export const toggleThemeMode = (value: string) => {
  if (value === 'light') {
    return DEFAULT_APP_THEME
  }

  return 'light'
}
