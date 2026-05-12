import { describe, expect, it } from "vitest"

import { buildServer } from "../server"

describe("API server", () => {
  it("responds to root checks", async () => {
    const server = buildServer({ logger: false })

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
    const server = buildServer({ logger: false })

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
