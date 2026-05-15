export type UserSession = {
  id: string
  userId: string
  tokenHash: string
  createdAt: Date
  lastUsedAt: Date
  expiresAt: Date
  absoluteExpiresAt: Date
  revokedAt?: Date
}

export type UserSessionRepository = {
  findByTokenHash(tokenHash: string): Promise<UserSession | undefined>
  save(session: UserSession): Promise<void>
}

export type SessionTokenGenerator = {
  generate(): string
}

export type SessionTokenHasher = {
  hash(token: string): Promise<string>
}
