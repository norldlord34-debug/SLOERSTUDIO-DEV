export type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastHandler = (type: ToastType, title: string, message?: string) => void

let addToastFn: ToastHandler | null = null

export function setToastHandler(handler: ToastHandler | null) {
  addToastFn = handler
}

export function showToast(type: ToastType, title: string, message?: string) {
  addToastFn?.(type, title, message)
}
