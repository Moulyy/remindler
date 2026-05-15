import { describe, expect, it } from "vitest"

import {
  InvalidUserSessionError,
  LogoutUserUseCase,
  SessionTokenHasher,
  UserSession,
  UserSessionRepository
} from "../index"

describe("LogoutUserUseCase", () => {
  it("revokes the current user session", async () => {
    const now = new Date("2026-05-15T08:30:00.000Z")
    const session: UserSession = {
      id: "session_123",
      userId: "user_123",
      tokenHash: "hashed_session_token",
      createdAt: new Date("2026-05-01T08:30:00.000Z"),
      lastUsedAt: new Date("2026-05-10T08:30:00.000Z"),
      expiresAt: new Date("2026-06-01T08:30:00.000Z"),
      absoluteExpiresAt: new Date("2026-08-01T08:30:00.000Z")
    }
    const { userSessionRepository, useCase } = createUseCase({
      now,
      sessions: [session]
    })

    await useCase.execute({
      token: "session_token"
    })

    expect(userSessionRepository.savedSessions).toEqual([
      {
        ...session,
        lastUsedAt: now,
        revokedAt: now
      }
    ])
  })

  it("rejects unknown tokens", async () => {
    const { useCase } = createUseCase()

    await expect(useCase.execute({ token: "session_token" })).rejects.toThrow(
      InvalidUserSessionError
    )
  })

  it("rejects empty tokens", async () => {
    const { useCase } = createUseCase()

    await expect(useCase.execute({ token: "   " })).rejects.toThrow(InvalidUserSessionError)
  })

  it("rejects already revoked sessions", async () => {
    const { useCase } = createUseCase({
      sessions: [
        {
          id: "session_123",
          userId: "user_123",
          tokenHash: "hashed_session_token",
          createdAt: new Date("2026-05-01T08:30:00.000Z"),
          lastUsedAt: new Date("2026-05-10T08:30:00.000Z"),
          expiresAt: new Date("2026-06-01T08:30:00.000Z"),
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
    useCase: new LogoutUserUseCase(
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
