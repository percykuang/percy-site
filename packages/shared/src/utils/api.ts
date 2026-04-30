import type { ApiSuccess } from '../types/api'

export function unwrapApiResponse<T>(response: ApiSuccess<T>) {
  return response.data
}
