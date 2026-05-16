import { EmptyUserPasswordError } from "@remindler/application"
import { DomainError } from "@remindler/domain"
import cors from "@fastify/cors"
import Fastify from "fastify"
import { FastifyPluginAsync } from "fastify"

import { AppDependencies, createAppDependencies } from "./composition-root"
import { ApiError } from "./errors/api-error"
import { authRoutes } from "./routes/auth-routes"
import { houseRoutes } from "./routes/house-routes"

export type BuildServerOptions = {
  logger?: boolean
  dependencies?: AppDependencies
}

export const buildServer = (options: BuildServerOptions = {}) => {
  const dependencies = options.dependencies ?? createAppDependencies()
  const server = Fastify({
    logger: options.logger ?? true
  })

  server.register(cors, {
    origin: process.env.WEB_APP_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })

  server.setErrorHandler((error, _request, reply) => {
    if (error instanceof ApiError) {
      return reply.code(error.statusCode).send({
        error: error.code,
        message: error.message
      })
    }

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
    await server.register(houseRoutes, dependencies)
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
