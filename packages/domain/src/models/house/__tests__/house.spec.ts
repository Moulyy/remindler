import { describe, expect, it } from "vitest"

import {
  EmptyHouseCreatedByError,
  EmptyHouseIdError,
  EmptyHouseNameError,
  House,
  InvalidHouseCreatedAtError
} from "../index"

describe("House", () => {
  it("creates a house", () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")

    const house = House.create("house_123", "Maison", "user_123", createdAt)

    expect(house.toSnapshot()).toEqual({
      id: "house_123",
      name: "Maison",
      createdBy: "user_123",
      createdAt
    })
  })

  it("trims house fields", () => {
    const house = House.create("  house_123  ", "  Maison  ", "  user_123  ")

    expect(house.toSnapshot()).toMatchObject({
      id: "house_123",
      name: "Maison",
      createdBy: "user_123"
    })
  })

  it("restores a house from a snapshot", () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")

    const house = House.fromSnapshot({
      id: "house_123",
      name: "Maison",
      createdBy: "user_123",
      createdAt
    })

    expect(house.toSnapshot()).toEqual({
      id: "house_123",
      name: "Maison",
      createdBy: "user_123",
      createdAt
    })
  })

  it("protects its creation date from external mutation", () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")
    const house = House.create("house_123", "Maison", "user_123", createdAt)

    createdAt.setFullYear(2030)
    const snapshot = house.toSnapshot()
    snapshot.createdAt.setFullYear(2040)

    expect(house.toSnapshot().createdAt).toEqual(new Date("2026-05-12T08:00:00.000Z"))
  })

  it("rejects empty house id", () => {
    expect(() => House.create("   ", "Maison", "user_123")).toThrow(EmptyHouseIdError)
  })

  it("rejects empty house name", () => {
    expect(() => House.create("house_123", "   ", "user_123")).toThrow(EmptyHouseNameError)
  })

  it("rejects empty house creator id", () => {
    expect(() => House.create("house_123", "Maison", "   ")).toThrow(EmptyHouseCreatedByError)
  })

  it("rejects invalid creation dates", () => {
    expect(() => House.create("house_123", "Maison", "user_123", new Date("invalid"))).toThrow(
      InvalidHouseCreatedAtError
    )
  })
})
