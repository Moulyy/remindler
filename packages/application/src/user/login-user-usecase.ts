import { UserSnapshot } from "@remindler/domain"

import {
  EmptyUserPasswordError,
  PasswordHasher,
  UserCredentialsRepository,
  UserRepository
} from "./register-user-usecase"

export type LoginUserInput = {
  email: string
  password: string
}

export type LoginUserOutput = {
  user: UserSnapshot
}

export class InvalidUserCredentialsError extends Error {
  constructor() {
    super("Invalid user credentials.")
    this.name = "InvalidUserCredentialsError"
  }
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userCredentialsRepository: UserCredentialsRepository,
    private readonly passwordHasher: PasswordHasher
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

    return {
      user: user.toSnapshot()
    }
  }
}

const assertIsNotEmptyPassword = (password: string): void => {
  if (password.trim() === "") {
    throw new EmptyUserPasswordError()
  }
}
