import { deleteCookie, getCookie, setCookie } from "@/lib/cookies"

const authTokenCookieName = "remindler_session_token"

export const getAuthToken = (): string | undefined => {
  return getCookie(authTokenCookieName)
}

export const setAuthToken = (token: string): void => {
  setCookie(authTokenCookieName, token)
}

export const clearAuthToken = (): void => {
  deleteCookie(authTokenCookieName)
}
