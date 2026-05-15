import { describe, expect, it } from "vitest"

import {
  AuthenticateUserUseCase,
  InvalidUserSessionError,
  SessionTokenHasher,
  UserSession,
  UserSessionRepository
} from "../index"

describe("AuthenticateUserUseCase", () => {
  it("authenticates a user from an active session", async () => {
    const now = new Date("2026-05-15T08:30:00.000Z")
    const session: UserSession = {
      id: "session_123",
      userId: "user_123",
      tokenHash: "hashed_session_token",
      createdAt: new Date("2026-05-01T08:30:00.000Z"),
      lastUsedAt: new Date("2026-05-10T08:30:00.000Z"),
      expiresAt: new Date("2026-05-20T08:30:00.000Z"),
      absoluteExpiresAt: new Date("2026-08-01T08:30:00.000Z")
    }
    const { userSessionRepository, useCase } = createUseCase({
      now,
      sessions: [session]
    })

    const output = await useCase.execute({
      token: "session_token"
    })

    expect(output).toEqual({
      userId: "user_123"
    })
    expect(userSessionRepository.savedSessions).toEqual([
      {
        ...session,
        lastUsedAt: now,
        expiresAt: new Date("2026-06-14T08:30:00.000Z")
      }
    ])
  })

  it("does not renew beyond the absolute expiration date", async () => {
    const now = new Date("2026-07-20T08:30:00.000Z")
    const session: UserSession = {
      id: "session_123",
      userId: "user_123",
      tokenHash: "hashed_session_token",
      createdAt: new Date("2026-05-01T08:30:00.000Z"),
      lastUsedAt: new Date("2026-07-10T08:30:00.000Z"),
      expiresAt: new Date("2026-07-25T08:30:00.000Z"),
      absoluteExpiresAt: new Date("2026-08-01T08:30:00.000Z")
    }
    const { userSessionRepository, useCase } = createUseCase({
      now,
      sessions: [session]
    })

    await useCase.execute({
      token: "session_token"
    })

    expect(userSessionRepository.savedSessions[0]?.expiresAt).toEqual(
      new Date("2026-08-01T08:30:00.000Z")
    )
  })

  it("rejects unknown tokens", async () => {
    const { useCase } = createUseCase()

    await expect(useCase.execute({ token: "session_token" })).rejects.toThrow(
      InvalidUserSessionError
    )
  })

  it("rejects expired sessions", async () => {
    const { useCase } = createUseCase({
      sessions: [
        {
          id: "session_123",
          userId: "user_123",
          tokenHash: "hashed_session_token",
          createdAt: new Date("2026-05-01T08:30:00.000Z"),
          lastUsedAt: new Date("2026-05-10T08:30:00.000Z"),
          expiresAt: new Date("2026-05-14T08:30:00.000Z"),
          absoluteExpiresAt: new Date("2026-08-01T08:30:00.000Z")
        }
      ]
    })

    await expect(useCase.execute({ token: "session_token" })).rejects.toThrow(
      InvalidUserSessionError
    )
  })

  it("rejects revoked sessions", async () => {
    const { useCase } = createUseCase({
      sessions: [
        {
          id: "session_123",
          userId: "user_123",
          tokenHash: "hashed_session_token",
          createdAt: new Date("2026-05-01T08:30:00.000Z"),
          lastUsedAt: new Date("2026-05-10T08:30:00.000Z"),
          expiresAt: new Date("2026-05-20T08:30:00.000Z"),
          absoluteExpiresAt: new Date("2026-08-01T08:30:00.000Z"),
          revokedAt: new Date("2026-05-12T08:30:00.000Z")
        }
      ]
    })

    await expect(useCase.execute({ token: "session_token" })).rejects.toThrow(
      InvalidUserSessionError
    )
  })
})

const createUseCase = ({
  now = new Date("2026-05-15T08:30:00.000Z"),
  sessions = []
}: {
  now?: Date
  sessions?: UserSession[]
} = {}) => {
  const sessionTokenHasher = createSessionTokenHasher("hashed_session_token")
  const userSessionRepository = createUserSessionRepository(sessions)

  return {
    userSessionRepository,
    useCase: new AuthenticateUserUseCase(
      {
        now: () => now
      },
      sessionTokenHasher,
      userSessionRepository
    )
  }
}

const createSessionTokenHasher = (tokenHash: string): SessionTokenHasher => ({
  hash: async () => tokenHash
})

const createUserSessionRepository = (
  sessions: UserSession[]
): UserSessionRepository & { savedSessions: UserSession[] } => {
  const savedSessions: UserSession[] = []

  return {
    savedSessions,
    findByTokenHash: async (tokenHash) =>
      sessions.find((session) => session.tokenHash === tokenHash),
    save: async (session) => {
      savedSessions.push(session)
    }
  }
}
