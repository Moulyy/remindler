import { HouseMemberRepository } from "@remindler/application"
import { HouseMember } from "@remindler/domain"

import { PrismaDatabaseClient } from "../database/prisma-client"

export class PrismaHouseMemberRepository implements HouseMemberRepository {
  constructor(private readonly prisma: PrismaDatabaseClient) {}

  async save(houseMember: HouseMember): Promise<void> {
    const snapshot = houseMember.toSnapshot()

    await this.prisma.houseMember.upsert({
      where: {
        id: snapshot.id
      },
      update: {
        role: snapshot.role
      },
      create: {
        id: snapshot.id,
        houseId: snapshot.houseId,
        userId: snapshot.userId,
        role: snapshot.role,
        joinedAt: snapshot.joinedAt
      }
    })
  }
}
