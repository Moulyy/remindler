import { describe, expect, it } from "vitest"

import { AppDependencies } from "../composition-root"
import { buildServer } from "../server"

describe("API server", () => {
  it("responds to root checks", async () => {
    const server = buildServer({ logger: false, dependencies: createDependencies() })

    const response = await server.inject({
      method: "GET",
      url: "/api"
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      name: "remindler-api",
      status: "ok"
    })
  })

  it("responds to health checks", async () => {
    const server = buildServer({ logger: false, dependencies: createDependencies() })

    const response = await server.inject({
      method: "GET",
      url: "/api/health"
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      status: "ok"
    })
  })
})

const createDependencies = (): AppDependencies => ({
  authenticateUserUseCase: {
    execute: async () => {
      throw new Error("Unexpected authenticate user use case call.")
    }
  },
  createHouseUseCase: {
    execute: async () => {
      throw new Error("Unexpected create house use case call.")
    }
  },
  loginUserUseCase: {
    execute: async () => {
      throw new Error("Unexpected login user use case call.")
    }
  },
  registerUserUseCase: {
    execute: async () => {
      throw new Error("Unexpected register user use case call.")
    }
  }
})
