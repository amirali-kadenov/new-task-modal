import type { CheckAnswerErrorResponse } from '@/types/api/api'

export const isApiError = (
  error: unknown,
): error is CheckAnswerErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null
  )
}
