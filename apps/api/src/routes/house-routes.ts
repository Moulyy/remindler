import { FastifyPluginAsync } from "fastify"

import { AppDependencies } from "../composition-root"
import { MissingAuthenticatedUserError } from "../errors/missing-authenticated-user-error"

type CreateHouseBody = {
  name: string
}

type CreateHouseHeaders = {
  "x-user-id"?: string
}

export const houseRoutes: FastifyPluginAsync<AppDependencies> = async (server, dependencies) => {
  server.post<{ Body: CreateHouseBody; Headers: CreateHouseHeaders }>(
    "/houses",
    {
      schema: {
        headers: {
          type: "object",
          required: ["x-user-id"],
          properties: {
            "x-user-id": { type: "string" }
          }
        },
        body: {
          type: "object",
          required: ["name"],
          additionalProperties: false,
          properties: {
            name: { type: "string" }
          }
        }
      }
    },
    async (request, reply) => {
      const createdBy = request.headers["x-user-id"]

      if (createdBy === undefined) {
        throw new MissingAuthenticatedUserError()
      }

      const output = await dependencies.createHouseUseCase.execute({
        name: request.body.name,
        createdBy
      })

      return reply.code(201).send(output)
    }
  )
}
