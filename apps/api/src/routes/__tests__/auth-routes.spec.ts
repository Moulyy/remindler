import {
  EmptyUserPasswordError,
  LoginUserInput,
  LoginUserOutput,
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
    const { dependencies, receivedRegisterInputs } = createTestContext()
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

    expect(receivedRegisterInputs).toEqual([
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

  it("logs in a user", async () => {
    const output: LoginUserOutput = {
      user: {
        id: "user_123",
        email: "alice@example.com",
        displayName: "Alice",
        createdAt: new Date("2026-05-12T08:00:00.000Z")
      },
      session: {
        token: "session_token",
        expiresAt: new Date("2026-06-14T08:30:00.000Z"),
        absoluteExpiresAt: new Date("2026-08-13T08:30:00.000Z")
      }
    }
    const server = buildServer({
      logger: false,
      dependencies: createTestContext(undefined, output).dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "alice@example.com",
        password: "password_123"
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      user: {
        id: "user_123",
        email: "alice@example.com",
        displayName: "Alice",
        createdAt: "2026-05-12T08:00:00.000Z"
      },
      session: {
        token: "session_token",
        expiresAt: "2026-06-14T08:30:00.000Z",
        absoluteExpiresAt: "2026-08-13T08:30:00.000Z"
      }
    })
  })

  it("passes login payload to the use case", async () => {
    const { dependencies, receivedLoginInputs } = createTestContext()
    const server = buildServer({
      logger: false,
      dependencies
    })

    await server.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "alice@example.com",
        password: "password_123"
      }
    })

    expect(receivedLoginInputs).toEqual([
      {
        email: "alice@example.com",
        password: "password_123"
      }
    ])
  })

  it("rejects malformed login payloads", async () => {
    const server = buildServer({
      logger: false,
      dependencies: createTestContext().dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "alice@example.com"
      }
    })

    expect(response.statusCode).toBe(400)
  })
})

const createTestContext = (
  registerResult: RegisterUserOutput | Error | undefined = {
    user: {
      id: "user_123",
      email: "alice@example.com",
      displayName: "Alice",
      createdAt: new Date("2026-05-12T08:00:00.000Z")
    }
  },
  loginResult: LoginUserOutput | Error = {
    user: {
      id: "user_123",
      email: "alice@example.com",
      displayName: "Alice",
      createdAt: new Date("2026-05-12T08:00:00.000Z")
    },
    session: {
      token: "session_token",
      expiresAt: new Date("2026-06-14T08:30:00.000Z"),
      absoluteExpiresAt: new Date("2026-08-13T08:30:00.000Z")
    }
  }
): {
  dependencies: AppDependencies
  receivedLoginInputs: LoginUserInput[]
  receivedRegisterInputs: RegisterUserInput[]
} => {
  const receivedLoginInputs: LoginUserInput[] = []
  const receivedRegisterInputs: RegisterUserInput[] = []

  return {
    dependencies: {
      createHouseUseCase: {
        execute: async () => {
          throw new Error("Unexpected create house use case call.")
        }
      },
      loginUserUseCase: {
        execute: async (input) => {
          receivedLoginInputs.push(input)

          if (loginResult instanceof Error) {
            throw loginResult
          }

          return loginResult
        }
      },
      registerUserUseCase: {
        execute: async (input) => {
          receivedRegisterInputs.push(input)

          if (registerResult instanceof Error) {
            throw registerResult
          }

          return registerResult!
        }
      }
    },
    receivedLoginInputs,
    receivedRegisterInputs
  }
}
