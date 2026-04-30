export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'CONFLICT'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'VALIDATION_ERROR'

export type ApiSuccess<T> = {
  data: T
}

export type ApiError = {
  error: {
    message: string
    code?: ApiErrorCode
    details?: Record<string, unknown>
  }
}
