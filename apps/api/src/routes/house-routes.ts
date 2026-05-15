import { FastifyPluginAsync } from "fastify"

import { authenticateRequest } from "../auth/authenticate-request"
import { AppDependencies } from "../composition-root"

type CreateHouseBody = {
  name: string
}

export const houseRoutes: FastifyPluginAsync<AppDependencies> = async (server, dependencies) => {
  server.post<{ Body: CreateHouseBody }>(
    "/houses",
    {
      schema: {
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
      const authenticatedUser = await authenticateRequest(request, dependencies)

      const output = await dependencies.createHouseUseCase.execute({
        name: request.body.name,
        createdBy: authenticatedUser.id
      })

      return reply.code(201).send(output)
    }
  )
}
