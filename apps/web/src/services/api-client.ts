const apiUrl = import.meta.env.VITE_API_URL

let unauthorizedHandler: (() => Promise<void> | void) | undefined

export const setUnauthorizedHandler = (handler: () => Promise<void> | void): void => {
  unauthorizedHandler = handler
}

export const apiFetch = async (path: string, init: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(init.headers)

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers
  })

  if (response.status === 401) {
    await unauthorizedHandler?.()
  }

  return response
}
