import { HouseRepository } from "@remindler/application"
import { House } from "@remindler/domain"

export class InMemoryHouseRepository implements HouseRepository {
  private readonly houses = new Map<string, House>()

  async save(house: House): Promise<void> {
    this.houses.set(house.toSnapshot().id, house)
  }
}
