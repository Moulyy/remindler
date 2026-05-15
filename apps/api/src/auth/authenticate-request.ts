import { InvalidUserSessionError } from "@remindler/application"
import { FastifyRequest } from "fastify"

import { AppDependencies } from "../composition-root"
import { UnauthenticatedError } from "../errors/missing-authenticated-user-error"

export type AuthenticatedUser = {
  id: string
}

export const authenticateRequest = async (
  request: FastifyRequest,
  dependencies: AppDependencies
): Promise<AuthenticatedUser> => {
  const token = extractBearerToken(request.headers.authorization)

  if (token === undefined) {
    throw new UnauthenticatedError()
  }

  try {
    const output = await dependencies.authenticateUserUseCase.execute({ token })

    return {
      id: output.userId
    }
  } catch (error) {
    if (error instanceof InvalidUserSessionError) {
      throw new UnauthenticatedError()
    }

    throw error
  }
}

const extractBearerToken = (authorizationHeader: string | undefined): string | undefined => {
  if (authorizationHeader === undefined) {
    return undefined
  }

  const [scheme, token] = authorizationHeader.split(" ")

  if (scheme !== "Bearer" || token === undefined || token.trim() === "") {
    return undefined
  }

  return token
}
