import { getAuthToken } from "./auth-session"

const apiUrl = import.meta.env.VITE_API_URL

export const apiFetch = async (path: string, init: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken()
  const headers = new Headers(init.headers)

  if (token !== undefined) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  return fetch(`${apiUrl}${path}`, {
    ...init,
    headers
  })
}
