import { User } from "@remindler/domain"
import { describe, expect, it } from "vitest"

import {
  EmptyUserPasswordError,
  InvalidUserCredentialsError,
  LoginUserUseCase,
  PasswordHasher,
  UserCredentials,
  UserCredentialsRepository,
  UserRepository
} from "../index"

describe("LoginUserUseCase", () => {
  it("logs in a user", async () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")
    const user = User.create("user_123", "alice@example.com", "Alice", createdAt)
    const { passwordHasher, useCase } = createUseCase({
      users: [user],
      credentials: [
        {
          userId: "user_123",
          passwordHash: "hashed_password",
          createdAt
        }
      ],
      validPassword: true
    })

    const output = await useCase.execute({
      email: "alice@example.com",
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
    expect(passwordHasher.verifiedPasswords).toEqual([
      {
        password: "password_123",
        hash: "hashed_password"
      }
    ])
  })

  it("rejects unknown emails", async () => {
    const { useCase } = createUseCase()

    await expect(
      useCase.execute({
        email: "alice@example.com",
        password: "password_123"
      })
    ).rejects.toThrow(InvalidUserCredentialsError)
  })

  it("rejects missing credentials", async () => {
    const user = User.create("user_123", "alice@example.com", "Alice")
    const { useCase } = createUseCase({ users: [user] })

    await expect(
      useCase.execute({
        email: "alice@example.com",
        password: "password_123"
      })
    ).rejects.toThrow(InvalidUserCredentialsError)
  })

  it("rejects invalid passwords", async () => {
    const user = User.create("user_123", "alice@example.com", "Alice")
    const { useCase } = createUseCase({
      users: [user],
      credentials: [
        {
          userId: "user_123",
          passwordHash: "hashed_password",
          createdAt: new Date("2026-05-12T08:00:00.000Z")
        }
      ],
      validPassword: false
    })

    await expect(
      useCase.execute({
        email: "alice@example.com",
        password: "wrong_password"
      })
    ).rejects.toThrow(InvalidUserCredentialsError)
  })

  it("rejects empty passwords", async () => {
    const { useCase } = createUseCase()

    await expect(
      useCase.execute({
        email: "alice@example.com",
        password: "   "
      })
    ).rejects.toThrow(EmptyUserPasswordError)
  })
})

const createUseCase = ({
  users = [],
  credentials = [],
  validPassword = true
}: {
  users?: User[]
  credentials?: UserCredentials[]
  validPassword?: boolean
} = {}) => {
  const userRepository = createUserRepository(users)
  const userCredentialsRepository = createUserCredentialsRepository(credentials)
  const passwordHasher = createPasswordHasher(validPassword)

  return {
    passwordHasher,
    useCase: new LoginUserUseCase(userRepository, userCredentialsRepository, passwordHasher)
  }
}

const createUserRepository = (users: User[]): UserRepository => ({
  findByEmail: async (email) =>
    users.find((user) => user.toSnapshot().email === email.trim().toLowerCase()),
  save: async (user) => {
    users.push(user)
  }
})

const createUserCredentialsRepository = (
  credentials: UserCredentials[]
): UserCredentialsRepository => ({
  findByUserId: async (userId) =>
    credentials.find((userCredentials) => userCredentials.userId === userId),
  save: async (userCredentials) => {
    credentials.push(userCredentials)
  }
})

const createPasswordHasher = (
  validPassword: boolean
): PasswordHasher & { verifiedPasswords: Array<{ password: string; hash: string }> } => {
  const verifiedPasswords: Array<{ password: string; hash: string }> = []

  return {
    verifiedPasswords,
    hash: async (password) => password,
    verify: async (password, hash) => {
      verifiedPasswords.push({ password, hash })
      return validPassword
    }
  }
}
