import { CreateHouseInput, CreateHouseOutput } from "@remindler/application"
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
        "x-user-id": "user_123"
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
    const { dependencies, receivedInputs } = createTestContext()
    const server = buildServer({
      logger: false,
      dependencies
    })

    await server.inject({
      method: "POST",
      url: "/api/houses",
      headers: {
        "x-user-id": "user_123"
      },
      payload: {
        name: "Maison"
      }
    })

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

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({
      error: "Bad Request",
      message: "headers must have required property 'x-user-id'"
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
        "x-user-id": "user_123"
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
  }
): { dependencies: AppDependencies; receivedInputs: CreateHouseInput[] } => {
  const receivedInputs: CreateHouseInput[] = []

  return {
    dependencies: {
      createHouseUseCase: {
        execute: async (input) => {
          receivedInputs.push(input)
          return result
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
      }
    },
    receivedInputs
  }
}
