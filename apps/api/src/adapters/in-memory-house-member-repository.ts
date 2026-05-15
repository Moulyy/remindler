import { HouseMemberRepository } from "@remindler/application"
import { HouseMember } from "@remindler/domain"

export class InMemoryHouseMemberRepository implements HouseMemberRepository {
  private readonly houseMembers = new Map<string, HouseMember>()

  async save(houseMember: HouseMember): Promise<void> {
    this.houseMembers.set(houseMember.toSnapshot().id, houseMember)
  }
}
