import { describe, expect, it } from "vitest"

import {
  EmptyHouseMemberHouseIdError,
  EmptyHouseMemberIdError,
  EmptyHouseMemberUserIdError,
  HouseMember,
  InvalidHouseMemberJoinedAtError,
  InvalidHouseMemberRoleError
} from "../index"
import { HouseMemberSnapshot } from "../house-member.types"

describe("HouseMember", () => {
  it("creates a house member", () => {
    const joinedAt = new Date("2026-05-12T08:00:00.000Z")

    const houseMember = HouseMember.create("member_123", "house_123", "user_123", "owner", joinedAt)

    expect(houseMember.toSnapshot()).toEqual({
      id: "member_123",
      houseId: "house_123",
      userId: "user_123",
      role: "owner",
      joinedAt
    })
  })

  it("trims house member fields", () => {
    const houseMember = HouseMember.create(
      "  member_123  ",
      "  house_123  ",
      "  user_123  ",
      "member"
    )

    expect(houseMember.toSnapshot()).toMatchObject({
      id: "member_123",
      houseId: "house_123",
      userId: "user_123",
      role: "member"
    })
  })

  it("restores a house member from a snapshot", () => {
    const joinedAt = new Date("2026-05-12T08:00:00.000Z")

    const houseMember = HouseMember.fromSnapshot({
      id: "member_123",
      houseId: "house_123",
      userId: "user_123",
      role: "admin",
      joinedAt
    })

    expect(houseMember.toSnapshot()).toEqual({
      id: "member_123",
      houseId: "house_123",
      userId: "user_123",
      role: "admin",
      joinedAt
    })
  })

  it("protects its join date from external mutation", () => {
    const joinedAt = new Date("2026-05-12T08:00:00.000Z")
    const houseMember = HouseMember.create("member_123", "house_123", "user_123", "owner", joinedAt)

    joinedAt.setFullYear(2030)
    const snapshot = houseMember.toSnapshot()
    snapshot.joinedAt.setFullYear(2040)

    expect(houseMember.toSnapshot().joinedAt).toEqual(new Date("2026-05-12T08:00:00.000Z"))
  })

  it("rejects empty house member id", () => {
    expect(() => HouseMember.create("   ", "house_123", "user_123", "owner")).toThrow(
      EmptyHouseMemberIdError
    )
  })

  it("rejects empty house id", () => {
    expect(() => HouseMember.create("member_123", "   ", "user_123", "owner")).toThrow(
      EmptyHouseMemberHouseIdError
    )
  })

  it("rejects empty user id", () => {
    expect(() => HouseMember.create("member_123", "house_123", "   ", "owner")).toThrow(
      EmptyHouseMemberUserIdError
    )
  })

  it("rejects invalid roles", () => {
    const snapshot = {
      id: "member_123",
      houseId: "house_123",
      userId: "user_123",
      role: "invalid",
      joinedAt: new Date("2026-05-12T08:00:00.000Z")
    } as unknown as HouseMemberSnapshot

    expect(() => HouseMember.fromSnapshot(snapshot)).toThrow(InvalidHouseMemberRoleError)
  })

  it("rejects invalid join dates", () => {
    expect(() =>
      HouseMember.create("member_123", "house_123", "user_123", "owner", new Date("invalid"))
    ).toThrow(InvalidHouseMemberJoinedAtError)
  })
})
