import { unwrapApiResponse, type ApiSuccess } from '@ps/shared/api'

type WebFetchRequest = string
type WebFetchOptions = Parameters<typeof $fetch>[1]

export async function webApiFetch<T>(url: WebFetchRequest, options?: WebFetchOptions) {
  const response = await $fetch<ApiSuccess<T>>(url, options)

  return unwrapApiResponse(response)
}
