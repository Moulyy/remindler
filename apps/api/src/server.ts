import { EmptyUserPasswordError } from "@remindler/application"
import { DomainError } from "@remindler/domain"
import Fastify from "fastify"
import { FastifyPluginAsync } from "fastify"

import { AppDependencies, createAppDependencies } from "./composition-root"
import { authRoutes } from "./routes/auth-routes"

export type BuildServerOptions = {
  logger?: boolean
  dependencies?: AppDependencies
}

export const buildServer = (options: BuildServerOptions = {}) => {
  const dependencies = options.dependencies ?? createAppDependencies()
  const server = Fastify({
    logger: options.logger ?? true
  })

  server.setErrorHandler((error, _request, reply) => {
    if (isBadRequestError(error)) {
      return reply.code(400).send({
        error: "Bad Request",
        message: error.message
      })
    }

    return reply.send(error)
  })

  server.register(createApiRoutes(dependencies), { prefix: "/api" })

  return server
}

const createApiRoutes = (dependencies: AppDependencies): FastifyPluginAsync => {
  return async (server) => {
    server.get("/", async () => {
      return {
        name: "remindler-api",
        status: "ok"
      }
    })

    server.get("/health", async () => {
      return {
        status: "ok"
      }
    })

    await server.register(authRoutes, dependencies)
  }
}

const isBadRequestError = (error: unknown): error is Error => {
  return (
    isFastifyValidationError(error) ||
    error instanceof DomainError ||
    error instanceof EmptyUserPasswordError
  )
}

const isFastifyValidationError = (error: unknown): error is Error & { validation: unknown } => {
  return error instanceof Error && "validation" in error
}
