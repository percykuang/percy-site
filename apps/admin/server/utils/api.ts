import type { ApiErrorCode, ApiSuccess } from '@ps/shared/api'
import type { H3Event } from 'h3'

type AdminApiErrorOptions = {
  statusCode: number
  code: ApiErrorCode
  message: string
  details?: Record<string, unknown>
}

type SafeParseSchema<T> = {
  safeParse: (input: unknown) =>
    | {
        success: true
        data: T
      }
    | {
        success: false
        error: {
          flatten: () => unknown
        }
      }
}

export function ok<T>(data: T): ApiSuccess<T> {
  return {
    data,
  }
}

export function apiError(options: AdminApiErrorOptions) {
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

export async function readValidatedBodyWithSchema<T>(event: H3Event, schema: SafeParseSchema<T>) {
  const body = await readBody(event)
  const result = schema.safeParse(body)

  if (!result.success) {
    throw apiError({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details: result.error.flatten() as Record<string, unknown>,
      message: '请求参数不合法',
    })
  }

  return result.data
}

export function readValidatedQueryWithSchema<T>(event: H3Event, schema: SafeParseSchema<T>) {
  const result = schema.safeParse(getQuery(event))

  if (!result.success) {
    throw apiError({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details: result.error.flatten() as Record<string, unknown>,
      message: '查询参数不合法',
    })
  }

  return result.data
}
