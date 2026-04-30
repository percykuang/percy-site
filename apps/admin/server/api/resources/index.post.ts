import { createResourceRecord } from '@ps/data-access'
import { readFormData } from 'h3'
import { apiError, ok } from '../../utils/api'
import {
  deleteStoredResource,
  ResourceUploadValidationError,
  storeUploadedResource,
} from '../../utils/resource-storage'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const formData = await readFormData(event)
  const file = formData.get('file')

  if (!isUploadFile(file)) {
    throw apiError({
      statusCode: 400,
      code: 'BAD_REQUEST',
      message: '请选择要上传的文件',
    })
  }

  let storedFile

  try {
    storedFile = await storeUploadedResource(file)
  } catch (error) {
    if (error instanceof ResourceUploadValidationError) {
      throw apiError({
        statusCode: 400,
        code: 'BAD_REQUEST',
        message: error.message,
      })
    }

    throw error
  }

  try {
    const resource = await createResourceRecord({
      alt: getOptionalFormString(formData, 'alt'),
      createdById: user.id,
      extension: storedFile.extension,
      mimeType: storedFile.mimeType,
      originalFilename: file.name || storedFile.storageKey,
      size: storedFile.size,
      storageKey: storedFile.storageKey,
      title: getOptionalFormString(formData, 'title'),
      type: storedFile.type,
      url: storedFile.url,
    })

    return ok(resource)
  } catch (error) {
    await deleteStoredResource(storedFile.storageKey)

    throw error
  }
})

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== 'undefined' && value instanceof File
}

function getOptionalFormString(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === 'string' ? value.trim() || undefined : undefined
}
