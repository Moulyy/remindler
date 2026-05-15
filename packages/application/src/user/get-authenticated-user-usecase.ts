import { UserSnapshot } from "@remindler/domain"

import { UserRepository } from "./register-user-usecase"

export type GetAuthenticatedUserInput = {
  userId: string
}

export type GetAuthenticatedUserOutput = {
  user: UserSnapshot
}

export class AuthenticatedUserNotFoundError extends Error {
  constructor() {
    super("Authenticated user not found.")
    this.name = "AuthenticatedUserNotFoundError"
  }
}

export class GetAuthenticatedUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetAuthenticatedUserInput): Promise<GetAuthenticatedUserOutput> {
    const user = await this.userRepository.findById(input.userId)

    if (user === undefined) {
      throw new AuthenticatedUserNotFoundError()
    }

    return {
      user: user.toSnapshot()
    }
  }
}
