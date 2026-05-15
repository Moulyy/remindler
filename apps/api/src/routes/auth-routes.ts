import { InvalidUserSessionError } from "@remindler/application"
import { FastifyPluginAsync } from "fastify"

import { authenticateRequest, extractBearerToken } from "../auth/authenticate-request"
import { AppDependencies } from "../composition-root"
import { UnauthenticatedError } from "../errors/missing-authenticated-user-error"

type RegisterUserBody = {
  email: string
  displayName: string
  password: string
}

type LoginUserBody = {
  email: string
  password: string
}

export const authRoutes: FastifyPluginAsync<AppDependencies> = async (server, dependencies) => {
  server.get("/auth/me", async (request) => {
    const authenticatedUser = await authenticateRequest(request, dependencies)

    return dependencies.getAuthenticatedUserUseCase.execute({
      userId: authenticatedUser.id
    })
  })

  server.post<{ Body: RegisterUserBody }>(
    "/auth/register",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "displayName", "password"],
          additionalProperties: false,
          properties: {
            email: { type: "string" },
            displayName: { type: "string" },
            password: { type: "string" }
          }
        }
      }
    },
    async (request, reply) => {
      const output = await dependencies.registerUserUseCase.execute(request.body)

      return reply.code(201).send(output)
    }
  )

  server.post<{ Body: LoginUserBody }>(
    "/auth/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          additionalProperties: false,
          properties: {
            email: { type: "string" },
            password: { type: "string" }
          }
        }
      }
    },
    async (request) => {
      return dependencies.loginUserUseCase.execute(request.body)
    }
  )

  server.post("/auth/logout", async (request, reply) => {
    const token = extractBearerToken(request.headers.authorization)

    if (token === undefined) {
      throw new UnauthenticatedError()
    }

    try {
      await dependencies.logoutUserUseCase.execute({ token })
    } catch (error) {
      if (error instanceof InvalidUserSessionError) {
        throw new UnauthenticatedError()
      }

      throw error
    }

    return reply.code(204).send()
  })
}
