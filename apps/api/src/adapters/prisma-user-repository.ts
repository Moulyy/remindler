import { UserRepository } from "@remindler/application"
import { User } from "@remindler/domain"

import { PrismaDatabaseClient } from "../database/prisma-client"
import { User as PrismaUser } from "../generated/prisma/client"

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaDatabaseClient) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase()
      }
    })

    return user === null ? undefined : toDomainUser(user)
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    return user === null ? undefined : toDomainUser(user)
  }

  async save(user: User): Promise<void> {
    const snapshot = user.toSnapshot()

    await this.prisma.user.upsert({
      where: {
        id: snapshot.id
      },
      update: {
        email: snapshot.email,
        displayName: snapshot.displayName
      },
      create: {
        id: snapshot.id,
        email: snapshot.email,
        displayName: snapshot.displayName,
        createdAt: snapshot.createdAt
      }
    })
  }
}

const toDomainUser = (user: PrismaUser): User => {
  return User.fromSnapshot({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt
  })
}
