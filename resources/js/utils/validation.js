export const SAFETY_MESSAGES = {
  blank: 'Error unable to proceed blank.',
  invalidEmail: 'Please enter a valid email address.',
  passwordTooShort: 'Password must be at least 8 characters.',
  passwordMismatch: 'Passwords do not match.',
  positiveAmount: 'Amount must be greater than 0.',
  nonNegativeAmount: 'Value cannot be negative.',
}

export function isBlank(value) {
  return !String(value ?? '').trim()
}

export function isValidEmail(value) {
  if (isBlank(value)) return false

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
}
