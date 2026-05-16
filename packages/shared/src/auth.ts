export type AuthenticatedUserDto = {
  id: string
  email: string
  displayName: string
  createdAt: string
}

export type LoginUserRequest = {
  email: string
  password: string
}

export type RegisterUserRequest = {
  email: string
  displayName: string
  password: string
}

export type RegisterUserResponse = {
  user: AuthenticatedUserDto
}

export type LoginUserResponse = {
  user: AuthenticatedUserDto
  session: {
    token: string
    expiresAt: string
    absoluteExpiresAt: string
  }
}

export type GetAuthenticatedUserResponse = {
  user: AuthenticatedUserDto
}
