import {
  AuthenticateUserInput,
  CreateHouseInput,
  CreateHouseOutput,
  InvalidUserSessionError
} from "@remindler/application"
import { describe, expect, it } from "vitest"

import { AppDependencies } from "../../composition-root"
import { buildServer } from "../../server"

describe("house routes", () => {
  it("creates a house", async () => {
    const output: CreateHouseOutput = {
      house: {
        id: "house_123",
        name: "Maison",
        createdBy: "user_123",
        createdAt: new Date("2026-05-12T08:00:00.000Z")
      },
      owner: {
        id: "member_123",
        houseId: "house_123",
        userId: "user_123",
        role: "owner",
        joinedAt: new Date("2026-05-12T08:00:00.000Z")
      }
    }
    const server = buildServer({
      logger: false,
      dependencies: createTestContext(output).dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/houses",
      headers: {
        authorization: "Bearer session_token"
      },
      payload: {
        name: "Maison"
      }
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual({
      house: {
        id: "house_123",
        name: "Maison",
        createdBy: "user_123",
        createdAt: "2026-05-12T08:00:00.000Z"
      },
      owner: {
        id: "member_123",
        houseId: "house_123",
        userId: "user_123",
        role: "owner",
        joinedAt: "2026-05-12T08:00:00.000Z"
      }
    })
  })

  it("passes create house payload to the use case", async () => {
    const { dependencies, receivedAuthenticateInputs, receivedInputs } = createTestContext()
    const server = buildServer({
      logger: false,
      dependencies
    })

    await server.inject({
      method: "POST",
      url: "/api/houses",
      headers: {
        authorization: "Bearer session_token"
      },
      payload: {
        name: "Maison"
      }
    })

    expect(receivedAuthenticateInputs).toEqual([
      {
        token: "session_token"
      }
    ])
    expect(receivedInputs).toEqual([
      {
        name: "Maison",
        createdBy: "user_123"
      }
    ])
  })

  it("rejects unauthenticated create house requests", async () => {
    const server = buildServer({
      logger: false,
      dependencies: createTestContext().dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/houses",
      payload: {
        name: "Maison"
      }
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({
      error: "UNAUTHENTICATED",
      message: "Authentication is required."
    })
  })

  it("rejects invalid bearer tokens", async () => {
    const server = buildServer({
      logger: false,
      dependencies: createTestContext(undefined, new InvalidUserSessionError()).dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/houses",
      headers: {
        authorization: "Bearer invalid_token"
      },
      payload: {
        name: "Maison"
      }
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({
      error: "UNAUTHENTICATED",
      message: "Authentication is required."
    })
  })

  it("rejects malformed create house payloads", async () => {
    const server = buildServer({
      logger: false,
      dependencies: createTestContext().dependencies
    })

    const response = await server.inject({
      method: "POST",
      url: "/api/houses",
      headers: {
        authorization: "Bearer session_token"
      },
      payload: {}
    })

    expect(response.statusCode).toBe(400)
  })
})

const createTestContext = (
  result: CreateHouseOutput = {
    house: {
      id: "house_123",
      name: "Maison",
      createdBy: "user_123",
      createdAt: new Date("2026-05-12T08:00:00.000Z")
    },
    owner: {
      id: "member_123",
      houseId: "house_123",
      userId: "user_123",
      role: "owner",
      joinedAt: new Date("2026-05-12T08:00:00.000Z")
    }
  },
  authenticateResult: { userId: string } | Error = { userId: "user_123" }
): {
  dependencies: AppDependencies
  receivedAuthenticateInputs: AuthenticateUserInput[]
  receivedInputs: CreateHouseInput[]
} => {
  const receivedAuthenticateInputs: AuthenticateUserInput[] = []
  const receivedInputs: CreateHouseInput[] = []

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
        execute: async (input) => {
          receivedInputs.push(input)
          return result
        }
      },
      getAuthenticatedUserUseCase: {
        execute: async () => {
          throw new Error("Unexpected get authenticated user use case call.")
        }
      },
      registerUserUseCase: {
        execute: async () => {
          throw new Error("Unexpected register user use case call.")
        }
      },
      loginUserUseCase: {
        execute: async () => {
          throw new Error("Unexpected login user use case call.")
        }
      },
      logoutUserUseCase: {
        execute: async () => {
          throw new Error("Unexpected logout user use case call.")
        }
      }
    },
    receivedAuthenticateInputs,
    receivedInputs
  }
}
