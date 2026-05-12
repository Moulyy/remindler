import { EmptyUserEmailError, User } from "@remindler/domain"
import { describe, expect, it } from "vitest"

import { Clock, IdGenerator } from "../../common"
import {
  EmptyUserPasswordError,
  PasswordHasher,
  RegisterUserUseCase,
  UserCredentials,
  UserCredentialsRepository,
  UserRepository
} from "../register-user-usecase"

describe("RegisterUserUseCase", () => {
  it("registers a user with password credentials", async () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")
    const { passwordHasher, userCredentialsRepository, userRepository, useCase } = createUseCase({
      id: "user_123",
      now: createdAt,
      passwordHash: "hashed_password"
    })

    const output = await useCase.execute({
      email: "alice@example.com",
      displayName: "Alice",
      password: "password_123"
    })

    expect(output).toEqual({
      user: {
        id: "user_123",
        email: "alice@example.com",
        displayName: "Alice",
        createdAt
      }
    })
    expect(passwordHasher.hashedPasswords).toEqual(["password_123"])
    expect(userRepository.savedUsers.map((user) => user.toSnapshot())).toEqual([output.user])
    expect(userCredentialsRepository.savedCredentials).toEqual([
      {
        userId: "user_123",
        passwordHash: "hashed_password",
        createdAt
      }
    ])
  })

  it("does not save anything when user validation fails", async () => {
    const { passwordHasher, userCredentialsRepository, userRepository, useCase } = createUseCase({
      id: "user_123",
      now: new Date("2026-05-12T08:00:00.000Z"),
      passwordHash: "hashed_password"
    })

    await expect(
      useCase.execute({
        email: "   ",
        displayName: "Alice",
        password: "password_123"
      })
    ).rejects.toThrow(EmptyUserEmailError)

    expect(passwordHasher.hashedPasswords).toEqual([])
    expect(userRepository.savedUsers).toEqual([])
    expect(userCredentialsRepository.savedCredentials).toEqual([])
  })

  it("does not save anything when password validation fails", async () => {
    const { passwordHasher, userCredentialsRepository, userRepository, useCase } = createUseCase({
      id: "user_123",
      now: new Date("2026-05-12T08:00:00.000Z"),
      passwordHash: "hashed_password"
    })

    await expect(
      useCase.execute({
        email: "alice@example.com",
        displayName: "Alice",
        password: "   "
      })
    ).rejects.toThrow(EmptyUserPasswordError)

    expect(passwordHasher.hashedPasswords).toEqual([])
    expect(userRepository.savedUsers).toEqual([])
    expect(userCredentialsRepository.savedCredentials).toEqual([])
  })
})

const createUseCase = ({
  id,
  now,
  passwordHash
}: {
  id: string
  now: Date
  passwordHash: string
}) => {
  const passwordHasher = createPasswordHasher(passwordHash)
  const userRepository = createUserRepository()
  const userCredentialsRepository = createUserCredentialsRepository()

  return {
    passwordHasher,
    userRepository,
    userCredentialsRepository,
    useCase: new RegisterUserUseCase(
      createIdGenerator(id),
      createClock(now),
      passwordHasher,
      userRepository,
      userCredentialsRepository
    )
  }
}

const createIdGenerator = (id: string): IdGenerator => ({
  generate: () => id
})

const createClock = (now: Date): Clock => ({
  now: () => new Date(now)
})

const createPasswordHasher = (
  passwordHash: string
): PasswordHasher & { hashedPasswords: string[] } => {
  const hashedPasswords: string[] = []

  return {
    hashedPasswords,
    hash: async (password) => {
      hashedPasswords.push(password)
      return passwordHash
    }
  }
}

const createUserRepository = (): UserRepository & { savedUsers: User[] } => {
  const savedUsers: User[] = []

  return {
    savedUsers,
    save: async (user) => {
      savedUsers.push(user)
    }
  }
}

const createUserCredentialsRepository = (): UserCredentialsRepository & {
  savedCredentials: UserCredentials[]
} => {
  const savedCredentials: UserCredentials[] = []

  return {
    savedCredentials,
    save: async (credentials) => {
      savedCredentials.push(credentials)
    }
  }
}
