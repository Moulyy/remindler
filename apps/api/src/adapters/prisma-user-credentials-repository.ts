import { UserCredentials, UserCredentialsRepository } from "@remindler/application"

import { PrismaDatabaseClient } from "../database/prisma-client"

export class PrismaUserCredentialsRepository implements UserCredentialsRepository {
  constructor(private readonly prisma: PrismaDatabaseClient) {}

  async findByUserId(userId: string): Promise<UserCredentials | undefined> {
    const credentials = await this.prisma.userCredentials.findUnique({
      where: {
        userId
      }
    })

    if (credentials === null) {
      return undefined
    }

    return {
      userId: credentials.userId,
      passwordHash: credentials.passwordHash,
      createdAt: credentials.createdAt
    }
  }

  async save(credentials: UserCredentials): Promise<void> {
    await this.prisma.userCredentials.upsert({
      where: {
        userId: credentials.userId
      },
      update: {
        passwordHash: credentials.passwordHash
      },
      create: {
        userId: credentials.userId,
        passwordHash: credentials.passwordHash,
        createdAt: credentials.createdAt
      }
    })
  }
}
