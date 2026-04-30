import type { ApiErrorCode, ApiSuccess } from '@ps/shared/api'
import type { H3Event } from 'h3'

type WebApiErrorOptions = {
  statusCode: number
  code: ApiErrorCode
  message: string
  details?: Record<string, unknown>
}

export function ok<T>(data: T): ApiSuccess<T> {
  return {
    data,
  }
}

export function apiError(options: WebApiErrorOptions) {
  return createError({
    statusCode: options.statusCode,
    statusMessage: options.message,
    data: {
      error: {
        code: options.code,
        details: options.details,
        message: options.message,
      },
    },
  })
}

export function getRequiredRouteParam(event: H3Event, paramName: string, message: string) {
  const value = getRouterParam(event, paramName)

  if (!value) {
    throw apiError({
      statusCode: 400,
      code: 'BAD_REQUEST',
      details: {
        paramName,
      },
      message,
    })
  }

  return value
}
