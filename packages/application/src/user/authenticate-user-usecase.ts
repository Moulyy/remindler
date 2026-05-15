import { Clock } from "../common"
import { SessionTokenHasher, UserSession, UserSessionRepository } from "./user-session"

export type AuthenticateUserInput = {
  token: string
}

export type AuthenticateUserOutput = {
  userId: string
}

export class InvalidUserSessionError extends Error {
  constructor() {
    super("Invalid user session.")
    this.name = "InvalidUserSessionError"
  }
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly clock: Clock,
    private readonly sessionTokenHasher: SessionTokenHasher,
    private readonly userSessionRepository: UserSessionRepository
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const token = input.token.trim()

    if (token === "") {
      throw new InvalidUserSessionError()
    }

    const tokenHash = await this.sessionTokenHasher.hash(token)
    const session = await this.userSessionRepository.findByTokenHash(tokenHash)

    if (session === undefined || !isActiveSession(session, this.clock.now())) {
      throw new InvalidUserSessionError()
    }

    await this.userSessionRepository.save(renewSession(session, this.clock.now()))

    return {
      userId: session.userId
    }
  }
}

const isActiveSession = (session: UserSession, now: Date): boolean => {
  return (
    session.revokedAt === undefined && session.expiresAt > now && session.absoluteExpiresAt > now
  )
}

const renewSession = (session: UserSession, now: Date): UserSession => {
  const nextExpiresAt = addDays(now, 30)

  return {
    ...session,
    lastUsedAt: now,
    expiresAt: nextExpiresAt > session.absoluteExpiresAt ? session.absoluteExpiresAt : nextExpiresAt
  }
}

const addDays = (date: Date, days: number): Date => {
  const nextDate = new Date(date)
  nextDate.setUTCDate(nextDate.getUTCDate() + days)

  return nextDate
}
