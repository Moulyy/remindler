const apiUrl = import.meta.env.VITE_API_URL

export const apiFetch = async (path: string, init: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(init.headers)

  return fetch(`${apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers
  })
}
