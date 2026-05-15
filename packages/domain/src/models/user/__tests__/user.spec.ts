import { describe, expect, it } from "vitest"

import {
  EmptyUserDisplayNameError,
  EmptyUserEmailError,
  EmptyUserIdError,
  InvalidUserCreatedAtError,
  InvalidUserEmailError,
  User
} from "../index"

describe("User", () => {
  it("creates a user", () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")

    const user = User.create("user_123", "alice@example.com", "Alice", createdAt)

    expect(user.toSnapshot()).toEqual({
      id: "user_123",
      email: "alice@example.com",
      displayName: "Alice",
      createdAt
    })
  })

  it("trims user fields and lowercases email", () => {
    const user = User.create("  user_123  ", "  Alice@Example.com  ", "  Alice  ")

    expect(user.toSnapshot()).toMatchObject({
      id: "user_123",
      email: "alice@example.com",
      displayName: "Alice"
    })
  })

  it("restores a user from a snapshot", () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")

    const user = User.fromSnapshot({
      id: "user_123",
      email: "alice@example.com",
      displayName: "Alice",
      createdAt
    })

    expect(user.toSnapshot()).toEqual({
      id: "user_123",
      email: "alice@example.com",
      displayName: "Alice",
      createdAt
    })
  })

  it("protects its creation date from external mutation", () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")
    const user = User.create("user_123", "alice@example.com", "Alice", createdAt)

    createdAt.setFullYear(2030)
    const snapshot = user.toSnapshot()
    snapshot.createdAt.setFullYear(2040)

    expect(user.toSnapshot().createdAt).toEqual(new Date("2026-05-12T08:00:00.000Z"))
  })

  it("rejects empty user id", () => {
    expect(() => User.create("   ", "alice@example.com", "Alice")).toThrow(EmptyUserIdError)
  })

  it("rejects empty user email", () => {
    expect(() => User.create("user_123", "   ", "Alice")).toThrow(EmptyUserEmailError)
  })

  it("rejects invalid user email", () => {
    expect(() => User.create("user_123", "alice", "Alice")).toThrow(InvalidUserEmailError)
    expect(() => User.create("user_123", "alice@example", "Alice")).toThrow(InvalidUserEmailError)
    expect(() => User.create("user_123", "alice@@example.com", "Alice")).toThrow(
      InvalidUserEmailError
    )
  })

  it("rejects empty display name", () => {
    expect(() => User.create("user_123", "alice@example.com", "   ")).toThrow(
      EmptyUserDisplayNameError
    )
  })

  it("rejects invalid creation dates", () => {
    expect(() =>
      User.create("user_123", "alice@example.com", "Alice", new Date("invalid"))
    ).toThrow(InvalidUserCreatedAtError)
  })
})
