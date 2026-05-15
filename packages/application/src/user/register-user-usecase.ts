import { User, UserSnapshot } from "@remindler/domain"

import { Clock, IdGenerator } from "../common"

export type RegisterUserInput = {
  email: string
  displayName: string
  password: string
}

export type RegisterUserOutput = {
  user: UserSnapshot
}

export type UserCredentials = {
  userId: string
  passwordHash: string
  createdAt: Date
}

export type UserRepository = {
  findByEmail(email: string): Promise<User | undefined>
  findById(id: string): Promise<User | undefined>
  save(user: User): Promise<void>
}

export type UserCredentialsRepository = {
  findByUserId(userId: string): Promise<UserCredentials | undefined>
  save(credentials: UserCredentials): Promise<void>
}

export type PasswordHasher = {
  hash(password: string): Promise<string>
  verify(password: string, hash: string): Promise<boolean>
}

export class EmptyUserPasswordError extends Error {
  constructor() {
    super("User password cannot be empty.")
    this.name = "EmptyUserPasswordError"
  }
}

export class RegisterUserUseCase {
  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
    private readonly passwordHasher: PasswordHasher,
    private readonly userRepository: UserRepository,
    private readonly userCredentialsRepository: UserCredentialsRepository
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    assertIsNotEmptyPassword(input.password)

    const createdAt = this.clock.now()
    const user = User.create(this.idGenerator.generate(), input.email, input.displayName, createdAt)
    const passwordHash = await this.passwordHasher.hash(input.password)

    await this.userRepository.save(user)
    await this.userCredentialsRepository.save({
      userId: user.toSnapshot().id,
      passwordHash,
      createdAt
    })

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
