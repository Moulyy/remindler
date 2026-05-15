import {
  AuthenticateUserInput,
  EmptyUserPasswordError,
  GetAuthenticatedUserInput,
  GetAuthenticatedUserOutput,
  InvalidUserSessionError,
  LoginUserInput,
  LoginUserOutput,
  LogoutUserInput,
  RegisterUserInput,
  RegisterUserOutput
} from "@remindler/application"
import { describe, expect, it } from "vitest"

import { AppDependencies } from "../../composition-root"
import { buildServer } from "../../server"

describe("auth routes", () => {
  it("returns the authenticated user", async () => {
    const { dependencies, receivedAuthenticateInputs, receivedGetAuthenticatedUserInputs } =
      createTestContext()
    const server = buildServer({
      logger: false,
      dependencies
    })

    const response = await server.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        authorization: "Bearer session_token"
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      user: {
        id: "user_123",
        email: "alice@example.com",
        displayName: "Alice",
        createdAt: "2026-05-12T08:00:00.000Z"
      }
    })
    expect(receivedAuthenticateInputs).toEqual([
      {
        token: "session_token"
      }
    ])
    expect(receivedGetAuthenticatedUserInputs).toEqual([
      {
        userId: "user_123"
      }
    ])
  })

  it("rejects unauthenticated me requests", async () => {
    const server = buildServer({
      logger: false,
      dependencies: createTestContext().dependencies
    })

    const response = await server.inject({
      method: "GET",
      url: "/api/auth/me"
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({
      error: "UNAUTHENTICATED",
      message: "Authentication is required."
    })
  })

  it("rejects invalid me sessions", async () => {
    const server = buildServer({
      logger: false,
      dependencies: createTestContext(undefined, undefined, new InvalidUserSessionError())
        .dependencies
    })

    const response = await server.inject({
      method: "GET",
      url: "/api/auth/me",
      headers: {
        authorization: "Bearer invalid_token"
      }
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({
      error: "UNAUTHENTICATED",
      message: "Authentication is required."
    })
  })

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

  it("logs out the current user session", async () => {
    const { dependencies, receivedLogoutInputs } = createTestContext()
    const server = buildServer({
      logger: false,
      dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/logout",
      headers: {
        authorization: "Bearer session_token"
      }
    })

    expect(response.statusCode).toBe(204)
    expect(response.body).toBe("")
    expect(receivedLogoutInputs).toEqual([
      {
        token: "session_token"
      }
    ])
  })

  it("rejects unauthenticated logout requests", async () => {
    const server = buildServer({
      logger: false,
      dependencies: createTestContext().dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/logout"
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({
      error: "UNAUTHENTICATED",
      message: "Authentication is required."
    })
  })

  it("rejects invalid logout sessions", async () => {
    const server = buildServer({
      logger: false,
      dependencies: createTestContext(
        undefined,
        undefined,
        undefined,
        undefined,
        new InvalidUserSessionError()
      ).dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/auth/logout",
      headers: {
        authorization: "Bearer invalid_token"
      }
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({
      error: "UNAUTHENTICATED",
      message: "Authentication is required."
    })
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
  },
  authenticateResult: { userId: string } | Error = { userId: "user_123" },
  getAuthenticatedUserResult: GetAuthenticatedUserOutput | Error = {
    user: {
      id: "user_123",
      email: "alice@example.com",
      displayName: "Alice",
      createdAt: new Date("2026-05-12T08:00:00.000Z")
    }
  },
  logoutResult: Error | undefined = undefined
): {
  dependencies: AppDependencies
  receivedAuthenticateInputs: AuthenticateUserInput[]
  receivedGetAuthenticatedUserInputs: GetAuthenticatedUserInput[]
  receivedLoginInputs: LoginUserInput[]
  receivedLogoutInputs: LogoutUserInput[]
  receivedRegisterInputs: RegisterUserInput[]
} => {
  const receivedAuthenticateInputs: AuthenticateUserInput[] = []
  const receivedGetAuthenticatedUserInputs: GetAuthenticatedUserInput[] = []
  const receivedLoginInputs: LoginUserInput[] = []
  const receivedLogoutInputs: LogoutUserInput[] = []
  const receivedRegisterInputs: RegisterUserInput[] = []

  return {
    dependencies: {
      authenticateUserUseCase: {
        execute: async (input) => {
          receivedAuthenticateInputs.push(input)

          if (authenticateResult instanceof Error) {
            throw authenticateResult
          }

          return authenticateResult
        }
      },
      createHouseUseCase: {
        execute: async () => {
          throw new Error("Unexpected create house use case call.")
        }
      },
      getAuthenticatedUserUseCase: {
        execute: async (input) => {
          receivedGetAuthenticatedUserInputs.push(input)

          if (getAuthenticatedUserResult instanceof Error) {
            throw getAuthenticatedUserResult
          }

          return getAuthenticatedUserResult
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
      logoutUserUseCase: {
        execute: async (input) => {
          receivedLogoutInputs.push(input)

          if (logoutResult instanceof Error) {
            throw logoutResult
          }
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
    receivedAuthenticateInputs,
    receivedGetAuthenticatedUserInputs,
    receivedLoginInputs,
    receivedLogoutInputs,
    receivedRegisterInputs
  }
}
