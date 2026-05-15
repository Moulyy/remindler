import { HouseRepository } from "@remindler/application"
import { House } from "@remindler/domain"

import { PrismaDatabaseClient } from "../database/prisma-client"

export class PrismaHouseRepository implements HouseRepository {
  constructor(private readonly prisma: PrismaDatabaseClient) {}

  async save(house: House): Promise<void> {
    const snapshot = house.toSnapshot()

    await this.prisma.house.upsert({
      where: {
        id: snapshot.id
      },
      update: {
        name: snapshot.name
      },
      create: {
        id: snapshot.id,
        name: snapshot.name,
        createdBy: snapshot.createdBy,
        createdAt: snapshot.createdAt
      }
    })
  }
}
