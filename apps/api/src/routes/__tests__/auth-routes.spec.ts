import {
  EmptyUserPasswordError,
  RegisterUserInput,
  RegisterUserOutput
} from "@remindler/application"
import { describe, expect, it } from "vitest"

import { AppDependencies } from "../../composition-root"
import { buildServer } from "../../server"

describe("auth routes", () => {
  it("registers a user", async () => {
    const output: RegisterUserOutput = {
      user: {
        id: "user_123",
        email: "alice@example.com",
        displayName: "Alice",
        createdAt: new Date("2026-05-12T08:00:00.000Z")
      }
    }
    const server = buildServer({
      logger: false,
      dependencies: createTestContext(output).dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        email: "alice@example.com",
        displayName: "Alice",
        password: "password_123"
      }
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual({
      user: {
        id: "user_123",
        email: "alice@example.com",
        displayName: "Alice",
        createdAt: "2026-05-12T08:00:00.000Z"
      }
    })
  })

  it("passes register payload to the use case", async () => {
    const { dependencies, receivedInputs } = createTestContext()
    const server = buildServer({
      logger: false,
      dependencies
    })

    await server.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        email: "alice@example.com",
        displayName: "Alice",
        password: "password_123"
      }
    })

    expect(receivedInputs).toEqual([
      {
        email: "alice@example.com",
        displayName: "Alice",
        password: "password_123"
      }
    ])
  })

  it("rejects malformed register payloads", async () => {
    const server = buildServer({
      logger: false,
      dependencies: createTestContext().dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        email: "alice@example.com",
        displayName: "Alice"
      }
    })

    expect(response.statusCode).toBe(400)
  })

  it("maps register validation errors to bad requests", async () => {
    const server = buildServer({
      logger: false,
      dependencies: createTestContext(new EmptyUserPasswordError()).dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        email: "alice@example.com",
        displayName: "Alice",
        password: "   "
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({
      error: "Bad Request",
      message: "User password cannot be empty."
    })
  })
})

const createTestContext = (
  result: RegisterUserOutput | Error = {
    user: {
      id: "user_123",
      email: "alice@example.com",
      displayName: "Alice",
      createdAt: new Date("2026-05-12T08:00:00.000Z")
    }
  }
): { dependencies: AppDependencies; receivedInputs: RegisterUserInput[] } => {
  const receivedInputs: RegisterUserInput[] = []

  return {
    dependencies: {
      registerUserUseCase: {
        execute: async (input) => {
          receivedInputs.push(input)

          if (result instanceof Error) {
            throw result
          }

          return result
        }
      }
    },
    receivedInputs
  }
}
