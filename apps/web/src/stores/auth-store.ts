import type { AuthenticatedUserDto, LoginUserRequest } from "@remindler/shared"
import { readonly, ref } from "vue"

import { getAuthenticatedUser, login } from "@/services/auth-api"

type AuthStatus = "idle" | "authenticated" | "unauthenticated"

const currentUser = ref<AuthenticatedUserDto>()
const status = ref<AuthStatus>("idle")
let authenticationPromise: Promise<AuthenticatedUserDto> | undefined

export const useAuthStore = () => {
  const loadAuthenticatedUser = async (): Promise<AuthenticatedUserDto> => {
    if (currentUser.value !== undefined) {
      return currentUser.value
    }

    if (status.value === "unauthenticated") {
      throw new Error("User is not authenticated.")
    }

    authenticationPromise ??= fetchAuthenticatedUser()

    return authenticationPromise
  }

  const loginUser = async (credentials: LoginUserRequest): Promise<AuthenticatedUserDto> => {
    const user = await login(credentials)

    currentUser.value = user
    status.value = "authenticated"

    return user
  }

  const clearAuthenticatedUser = (): void => {
    currentUser.value = undefined
    status.value = "unauthenticated"
  }

  return {
    clearAuthenticatedUser,
    currentUser: readonly(currentUser),
    loadAuthenticatedUser,
    loginUser,
    status: readonly(status)
  }
}

const fetchAuthenticatedUser = async (): Promise<AuthenticatedUserDto> => {
  try {
    const user = await getAuthenticatedUser()

    currentUser.value = user
    status.value = "authenticated"

    return user
  } catch (error) {
    currentUser.value = undefined
    status.value = "unauthenticated"

    throw error
  } finally {
    authenticationPromise = undefined
  }
}
