import { FastifyReply, FastifyRequest } from "fastify"

import { isProductionEnv } from "../config/env"

export const sessionCookieName = "remindler_session"

const cookieMaxAgeInSeconds = 60 * 60 * 24 * 30

export const getSessionCookie = (request: FastifyRequest): string | undefined => {
  return request.cookies[sessionCookieName]
}

export const setSessionCookie = (reply: FastifyReply, token: string): void => {
  reply.setCookie(sessionCookieName, token, {
    httpOnly: true,
    maxAge: cookieMaxAgeInSeconds,
    path: "/",
    sameSite: "lax",
    secure: isProductionEnv()
  })
}

export const clearSessionCookie = (reply: FastifyReply): void => {
  reply.clearCookie(sessionCookieName, {
    path: "/",
    sameSite: "lax",
    secure: isProductionEnv()
  })
}
