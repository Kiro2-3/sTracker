export function showToast(message, type = 'success') {
  if (!message || typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent('app-toast', {
      detail: { message, type },
    }),
  )
}

export function showSuccessToast(message) {
  showToast(message, 'success')
}

export function showErrorToast(message) {
  showToast(message, 'error')
}
