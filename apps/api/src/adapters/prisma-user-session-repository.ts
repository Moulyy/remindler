import { UserSession, UserSessionRepository } from "@remindler/application"

import { PrismaDatabaseClient } from "../database/prisma-client"

export class PrismaUserSessionRepository implements UserSessionRepository {
  constructor(private readonly prisma: PrismaDatabaseClient) {}

  async findByTokenHash(tokenHash: string): Promise<UserSession | undefined> {
    const session = await this.prisma.userSession.findUnique({
      where: {
        tokenHash
      }
    })

    if (session === null) {
      return undefined
    }

    return {
      id: session.id,
      userId: session.userId,
      tokenHash: session.tokenHash,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
      absoluteExpiresAt: session.absoluteExpiresAt,
      revokedAt: session.revokedAt ?? undefined
    }
  }

  async save(session: UserSession): Promise<void> {
    await this.prisma.userSession.upsert({
      where: {
        id: session.id
      },
      update: {
        lastUsedAt: session.lastUsedAt,
        expiresAt: session.expiresAt,
        absoluteExpiresAt: session.absoluteExpiresAt,
        revokedAt: session.revokedAt
      },
      create: {
        id: session.id,
        userId: session.userId,
        tokenHash: session.tokenHash,
        createdAt: session.createdAt,
        lastUsedAt: session.lastUsedAt,
        expiresAt: session.expiresAt,
        absoluteExpiresAt: session.absoluteExpiresAt,
        revokedAt: session.revokedAt
      }
    })
  }
}
