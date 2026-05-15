import { User } from "@remindler/domain"
import { describe, expect, it } from "vitest"

import {
  AuthenticatedUserNotFoundError,
  GetAuthenticatedUserUseCase,
  UserRepository
} from "../index"

describe("GetAuthenticatedUserUseCase", () => {
  it("returns the authenticated user", async () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")
    const user = User.create("user_123", "alice@example.com", "Alice", createdAt)
    const useCase = new GetAuthenticatedUserUseCase(createUserRepository([user]))

    const output = await useCase.execute({
      userId: "user_123"
    })

    expect(output).toEqual({
      user: {
        id: "user_123",
        email: "alice@example.com",
        displayName: "Alice",
        createdAt
      }
    })
  })

  it("rejects missing authenticated users", async () => {
    const useCase = new GetAuthenticatedUserUseCase(createUserRepository())

    await expect(useCase.execute({ userId: "user_123" })).rejects.toThrow(
      AuthenticatedUserNotFoundError
    )
  })
})

const createUserRepository = (users: User[] = []): UserRepository => ({
  findByEmail: async (email) =>
    users.find((user) => user.toSnapshot().email === email.trim().toLowerCase()),
  findById: async (id) => users.find((user) => user.toSnapshot().id === id),
  save: async (user) => {
    users.push(user)
  }
})
