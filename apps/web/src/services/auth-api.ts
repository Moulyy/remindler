import type {
  AuthenticatedUserDto,
  GetAuthenticatedUserResponse,
  LoginUserRequest
} from "@remindler/shared"

import { apiFetch } from "./api-client"

export const login = async (credentials: LoginUserRequest): Promise<AuthenticatedUserDto> => {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  const data = (await response.json()) as GetAuthenticatedUserResponse

  return data.user
}

export const getAuthenticatedUser = async (): Promise<AuthenticatedUserDto> => {
  const response = await apiFetch("/auth/me")

  if (!response.ok) {
    throw new Error("Authentication failed")
  }

  const data = (await response.json()) as GetAuthenticatedUserResponse

  return data.user
}
