import {
  GetAuthenticatedUserOutput,
  InvalidUserSessionError,
  LoginUserOutput,
  RegisterUserOutput
} from "@remindler/application"
import {
  GetAuthenticatedUserResponse,
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse
} from "@remindler/shared"
import { FastifyPluginAsync } from "fastify"

import { authenticateRequest, extractBearerToken } from "../auth/authenticate-request"
import { clearSessionCookie, getSessionCookie, setSessionCookie } from "../auth/session-cookie"
import { AppDependencies } from "../composition-root"
import { UnauthenticatedError } from "../errors/missing-authenticated-user-error"

export const authRoutes: FastifyPluginAsync<AppDependencies> = async (server, dependencies) => {
  server.get("/auth/me", async (request) => {
    const authenticatedUser = await authenticateRequest(request, dependencies)
    const output = await dependencies.getAuthenticatedUserUseCase.execute({
      userId: authenticatedUser.id
    })

    return toGetAuthenticatedUserResponse(output)
  })

  server.post<{ Body: RegisterUserRequest }>(
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

      return reply.code(201).send(toRegisterUserResponse(output))
    }
  )

  server.post<{ Body: LoginUserRequest }>(
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
    async (request, reply) => {
      const output = await dependencies.loginUserUseCase.execute(request.body)
      setSessionCookie(reply, output.session.token)

      return toLoginUserResponse(output)
    }
  )

  server.post("/auth/logout", async (request, reply) => {
    const token = getSessionCookie(request) ?? extractBearerToken(request.headers.authorization)

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

    clearSessionCookie(reply)

    return reply.code(204).send()
  })
}

const toRegisterUserResponse = (output: RegisterUserOutput): RegisterUserResponse => {
  return {
    user: {
      id: output.user.id,
      email: output.user.email,
      displayName: output.user.displayName,
      createdAt: output.user.createdAt.toISOString()
    }
  }
}

const toGetAuthenticatedUserResponse = (
  output: GetAuthenticatedUserOutput
): GetAuthenticatedUserResponse => {
  return {
    user: {
      id: output.user.id,
      email: output.user.email,
      displayName: output.user.displayName,
      createdAt: output.user.createdAt.toISOString()
    }
  }
}

const toLoginUserResponse = (output: LoginUserOutput): LoginUserResponse => {
  return {
    user: {
      id: output.user.id,
      email: output.user.email,
      displayName: output.user.displayName,
      createdAt: output.user.createdAt.toISOString()
    }
  }
}
