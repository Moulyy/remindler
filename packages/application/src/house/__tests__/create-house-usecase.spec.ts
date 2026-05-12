import { EmptyHouseNameError, House, HouseMember } from "@remindler/domain"
import { describe, expect, it } from "vitest"

import { IdGenerator } from "../../common"
import {
  Clock,
  CreateHouseUseCase,
  HouseMemberRepository,
  HouseRepository
} from "../create-house-usecase"

describe("CreateHouseUseCase", () => {
  it("creates a house and its owner member", async () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")
    const { houseRepository, houseMemberRepository, useCase } = createUseCase({
      ids: ["house_123", "member_123"],
      now: createdAt
    })

    const output = await useCase.execute({
      name: "Maison",
      createdBy: "user_123"
    })

    expect(output).toEqual({
      house: {
        id: "house_123",
        name: "Maison",
        createdBy: "user_123",
        createdAt
      },
      owner: {
        id: "member_123",
        houseId: "house_123",
        userId: "user_123",
        role: "owner",
        joinedAt: createdAt
      }
    })
    expect(houseRepository.savedHouses.map((house) => house.toSnapshot())).toEqual([output.house])
    expect(houseMemberRepository.savedMembers.map((member) => member.toSnapshot())).toEqual([
      output.owner
    ])
  })

  it("uses generated ids in order", async () => {
    const { useCase } = createUseCase({
      ids: ["house_123", "member_123"],
      now: new Date("2026-05-12T08:00:00.000Z")
    })

    const output = await useCase.execute({
      name: "Maison",
      createdBy: "user_123"
    })

    expect(output.house.id).toBe("house_123")
    expect(output.owner.id).toBe("member_123")
  })

  it("does not save anything when house validation fails", async () => {
    const { houseRepository, houseMemberRepository, useCase } = createUseCase({
      ids: ["house_123", "member_123"],
      now: new Date("2026-05-12T08:00:00.000Z")
    })

    await expect(
      useCase.execute({
        name: "   ",
        createdBy: "user_123"
      })
    ).rejects.toThrow(EmptyHouseNameError)

    expect(houseRepository.savedHouses).toEqual([])
    expect(houseMemberRepository.savedMembers).toEqual([])
  })
})

const createUseCase = ({ ids, now }: { ids: string[]; now: Date }) => {
  const houseRepository = createHouseRepository()
  const houseMemberRepository = createHouseMemberRepository()

  return {
    houseRepository,
    houseMemberRepository,
    useCase: new CreateHouseUseCase(
      createIdGenerator(ids),
      createClock(now),
      houseRepository,
      houseMemberRepository
    )
  }
}

const createIdGenerator = (ids: string[]): IdGenerator => {
  let currentIdIndex = 0

  return {
    generate: () => ids[currentIdIndex++]
  }
}

const createClock = (now: Date): Clock => ({
  now: () => new Date(now)
})

const createHouseRepository = (): HouseRepository & { savedHouses: House[] } => {
  const savedHouses: House[] = []

  return {
    savedHouses,
    save: async (house) => {
      savedHouses.push(house)
    }
  }
}

const createHouseMemberRepository = (): HouseMemberRepository & { savedMembers: HouseMember[] } => {
  const savedMembers: HouseMember[] = []

  return {
    savedMembers,
    save: async (houseMember) => {
      savedMembers.push(houseMember)
    }
  }
}
