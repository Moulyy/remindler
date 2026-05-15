import { UserSnapshot } from "@remindler/domain"

import { Clock, IdGenerator } from "../common"
import {
  EmptyUserPasswordError,
  PasswordHasher,
  UserCredentialsRepository,
  UserRepository
} from "./register-user-usecase"
import { SessionTokenGenerator, SessionTokenHasher, UserSessionRepository } from "./user-session"

export type LoginUserInput = {
  email: string
  password: string
}

export type LoginUserOutput = {
  user: UserSnapshot
  session: {
    token: string
    expiresAt: Date
    absoluteExpiresAt: Date
  }
}

export class InvalidUserCredentialsError extends Error {
  constructor() {
    super("Invalid user credentials.")
    this.name = "InvalidUserCredentialsError"
  }
}

export class LoginUserUseCase {
  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
    private readonly userRepository: UserRepository,
    private readonly userCredentialsRepository: UserCredentialsRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly sessionTokenGenerator: SessionTokenGenerator,
    private readonly sessionTokenHasher: SessionTokenHasher,
    private readonly userSessionRepository: UserSessionRepository
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    assertIsNotEmptyPassword(input.password)

    const user = await this.userRepository.findByEmail(input.email)

    if (user === undefined) {
      throw new InvalidUserCredentialsError()
    }

    const credentials = await this.userCredentialsRepository.findByUserId(user.toSnapshot().id)

    if (credentials === undefined) {
      throw new InvalidUserCredentialsError()
    }

    const isPasswordValid = await this.passwordHasher.verify(
      input.password,
      credentials.passwordHash
    )

    if (!isPasswordValid) {
      throw new InvalidUserCredentialsError()
    }

    const now = this.clock.now()
    const token = this.sessionTokenGenerator.generate()
    const tokenHash = await this.sessionTokenHasher.hash(token)
    const expiresAt = addDays(now, 30)
    const absoluteExpiresAt = addDays(now, 90)
    const userSnapshot = user.toSnapshot()

    await this.userSessionRepository.save({
      id: this.idGenerator.generate(),
      userId: userSnapshot.id,
      tokenHash,
      createdAt: now,
      lastUsedAt: now,
      expiresAt,
      absoluteExpiresAt
    })

    return {
      user: userSnapshot,
      session: {
        token,
        expiresAt,
        absoluteExpiresAt
      }
    }
  }
}

const assertIsNotEmptyPassword = (password: string): void => {
  if (password.trim() === "") {
    throw new EmptyUserPasswordError()
  }
}

const addDays = (date: Date, days: number): Date => {
  const nextDate = new Date(date)
  nextDate.setUTCDate(nextDate.getUTCDate() + days)

  return nextDate
}
