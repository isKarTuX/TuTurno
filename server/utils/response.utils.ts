export function success<T>(data: T, meta?: { total?: number; page?: number; perPage?: number }) {
  return {
    success: true as const,
    data,
    meta,
  }
}

export function apiError(code: string, message: string, statusCode = 400) {
  return createError({
    statusCode,
    data: { success: false, error: { code, message } },
  })
}