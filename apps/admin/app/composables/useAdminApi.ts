import { unwrapApiResponse, type ApiError, type ApiSuccess } from '@ps/shared/api'

type AdminFetchRequest = string
type AdminFetchOptions = Parameters<typeof $fetch>[1]

export async function adminApiFetch<T>(url: AdminFetchRequest, options?: AdminFetchOptions) {
  if (import.meta.server) {
    const serverFetch = useRequestFetch() as unknown as (
      url: AdminFetchRequest,
      options?: AdminFetchOptions,
    ) => Promise<ApiSuccess<T>>

    return unwrapApiResponse(await serverFetch(url, options))
  }

  const response = await $fetch<ApiSuccess<T>>(url, options)

  return unwrapApiResponse(response)
}

export function getAdminApiErrorMessage(
  error: unknown,
  fallbackMessage = '操作失败，请稍后重试。',
) {
  if (typeof error === 'object' && error !== null) {
    const fetchError = error as {
      data?: ApiError
      statusMessage?: string
    }

    const apiMessage = fetchError.data?.error?.message

    if (apiMessage) {
      return apiMessage
    }

    if (fetchError.statusMessage) {
      return fetchError.statusMessage
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}
