import { House, HouseMember, HouseMemberSnapshot, HouseSnapshot } from "@remindler/domain"

import { IdGenerator } from "../common"

export type CreateHouseInput = {
  name: string
  createdBy: string
}

export type CreateHouseOutput = {
  house: HouseSnapshot
  owner: HouseMemberSnapshot
}

export type Clock = {
  now(): Date
}

export type HouseRepository = {
  save(house: House): Promise<void>
}

export type HouseMemberRepository = {
  save(houseMember: HouseMember): Promise<void>
}

export class CreateHouseUseCase {
  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
    private readonly houseRepository: HouseRepository,
    private readonly houseMemberRepository: HouseMemberRepository
  ) {}

  async execute(input: CreateHouseInput): Promise<CreateHouseOutput> {
    const createdAt = this.clock.now()
    const house = House.create(this.idGenerator.generate(), input.name, input.createdBy, createdAt)
    const owner = HouseMember.create(
      this.idGenerator.generate(),
      house.toSnapshot().id,
      input.createdBy,
      "owner",
      createdAt
    )

    await this.houseRepository.save(house)
    await this.houseMemberRepository.save(owner)

    return {
      house: house.toSnapshot(),
      owner: owner.toSnapshot()
    }
  }
}
