const cookieOptions = "path=/; max-age=2592000; samesite=lax"

export const getCookie = (name: string): string | undefined => {
  const cookie = document.cookie.split("; ").find((cookiePart) => cookiePart.startsWith(`${name}=`))

  if (cookie === undefined) {
    return undefined
  }

  return decodeURIComponent(cookie.split("=")[1] ?? "")
}

export const setCookie = (name: string, value: string): void => {
  document.cookie = `${name}=${encodeURIComponent(value)}; ${cookieOptions}`
}

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}
