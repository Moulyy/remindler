import { Clock } from "../common"
import { InvalidUserSessionError } from "./authenticate-user-usecase"
import { SessionTokenHasher, UserSessionRepository } from "./user-session"

export type LogoutUserInput = {
  token: string
}

export class LogoutUserUseCase {
  constructor(
    private readonly clock: Clock,
    private readonly sessionTokenHasher: SessionTokenHasher,
    private readonly userSessionRepository: UserSessionRepository
  ) {}

  async execute(input: LogoutUserInput): Promise<void> {
    const token = input.token.trim()

    if (token === "") {
      throw new InvalidUserSessionError()
    }

    const tokenHash = await this.sessionTokenHasher.hash(token)
    const session = await this.userSessionRepository.findByTokenHash(tokenHash)

    if (session === undefined || session.revokedAt !== undefined) {
      throw new InvalidUserSessionError()
    }

    const revokedAt = this.clock.now()

    await this.userSessionRepository.save({
      ...session,
      lastUsedAt: revokedAt,
      revokedAt
    })
  }
}
