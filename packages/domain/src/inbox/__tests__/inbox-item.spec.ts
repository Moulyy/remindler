import { describe, expect, it } from "vitest"

import {
  ArchivedItemCannotBeArchivedError,
  ArchivedItemCannotBeConvertedError,
  ConvertedItemCannotBeArchivedError,
  EmptyConvertedEntityIdError,
  EmptyInboxItemContentError,
  EmptyInboxItemIdError,
  EmptyInboxItemUserIdError,
  InboxItem,
  InboxItemAlreadyConvertedError
} from "../index"

describe("InboxItem", () => {
  describe("create", () => {
    it("creates a pending inbox item", () => {
      const beforeCreate = new Date()

      const inboxItem = InboxItem.create("inbox_123", "user_123", "Acheter du lait")
      const afterCreate = new Date()
      const snapshot = inboxItem.toSnapshot()

      expect(snapshot).toMatchObject({
        id: "inbox_123",
        userId: "user_123",
        rawContent: "Acheter du lait",
        status: "pending"
      })
      expect(snapshot.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime())
      expect(snapshot.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime())
      expect(snapshot.updatedAt).toEqual(snapshot.createdAt)
    })

    it("trims raw content", () => {
      const inboxItem = InboxItem.create("inbox_123", "user_123", "  Acheter du lait  ")

      expect(inboxItem.toSnapshot().rawContent).toBe("Acheter du lait")
    })

    it("rejects empty raw content", () => {
      expect(() => InboxItem.create("inbox_123", "user_123", "   ")).toThrow(
        EmptyInboxItemContentError
      )
    })

    it("rejects empty inbox item id", () => {
      expect(() => InboxItem.create("   ", "user_123", "Acheter du lait")).toThrow(
        EmptyInboxItemIdError
      )
    })

    it("rejects empty user id", () => {
      expect(() => InboxItem.create("inbox_123", "   ", "Acheter du lait")).toThrow(
        EmptyInboxItemUserIdError
      )
    })
  })

  describe("convert", () => {
    it("converts a pending inbox item", () => {
      const inboxItem = InboxItem.create("inbox_123", "user_123", "Acheter du lait")
      const beforeConvert = new Date()

      inboxItem.convert("shopping_456", "shopping")

      const afterConvert = new Date()
      const snapshot = inboxItem.toSnapshot()

      expect(snapshot).toMatchObject({
        status: "converted",
        convertedEntityId: "shopping_456",
        convertedEntityType: "shopping"
      })
      expect(snapshot.convertedAt).toBeInstanceOf(Date)
      expect(snapshot.convertedAt?.getTime()).toBeGreaterThanOrEqual(beforeConvert.getTime())
      expect(snapshot.convertedAt?.getTime()).toBeLessThanOrEqual(afterConvert.getTime())
      expect(snapshot.updatedAt).toEqual(snapshot.convertedAt)
    })

    it("trims converted entity id", () => {
      const inboxItem = InboxItem.create("inbox_123", "user_123", "Acheter du lait")

      inboxItem.convert("  shopping_456  ", "shopping")

      expect(inboxItem.toSnapshot().convertedEntityId).toBe("shopping_456")
    })

    it("rejects empty converted entity id", () => {
      const inboxItem = InboxItem.create("inbox_123", "user_123", "Acheter du lait")

      expect(() => inboxItem.convert("   ", "shopping")).toThrow(EmptyConvertedEntityIdError)
    })

    it("rejects already converted inbox items", () => {
      const now = new Date("2026-05-11T12:00:00.000Z")
      const inboxItem = InboxItem.fromSnapshot({
        id: "inbox_123",
        userId: "user_123",
        rawContent: "Acheter du lait",
        status: "converted",
        convertedEntityType: "shopping",
        convertedEntityId: "shopping_456",
        createdAt: now,
        updatedAt: now,
        convertedAt: now
      })

      expect(() => inboxItem.convert("task_789", "task")).toThrow(InboxItemAlreadyConvertedError)
    })

    it("rejects archived inbox items", () => {
      const now = new Date("2026-05-11T12:00:00.000Z")
      const inboxItem = InboxItem.fromSnapshot({
        id: "inbox_123",
        userId: "user_123",
        rawContent: "Acheter du lait",
        status: "archived",
        createdAt: now,
        updatedAt: now
      })

      expect(() => inboxItem.convert("shopping_456", "shopping")).toThrow(
        ArchivedItemCannotBeConvertedError
      )
    })
  })

  describe("archive", () => {
    it("archives a pending inbox item", () => {
      const inboxItem = InboxItem.create("inbox_123", "user_123", "Acheter du lait")
      const beforeArchive = new Date()

      inboxItem.archive()

      const afterArchive = new Date()
      const snapshot = inboxItem.toSnapshot()

      expect(snapshot.status).toBe("archived")
      expect(snapshot.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeArchive.getTime())
      expect(snapshot.updatedAt.getTime()).toBeLessThanOrEqual(afterArchive.getTime())
      expect(snapshot.convertedEntityId).toBeUndefined()
      expect(snapshot.convertedEntityType).toBeUndefined()
      expect(snapshot.convertedAt).toBeUndefined()
    })

    it("rejects already archived inbox items", () => {
      const now = new Date("2026-05-11T12:00:00.000Z")
      const inboxItem = InboxItem.fromSnapshot({
        id: "inbox_123",
        userId: "user_123",
        rawContent: "Acheter du lait",
        status: "archived",
        createdAt: now,
        updatedAt: now
      })

      expect(() => inboxItem.archive()).toThrow(ArchivedItemCannotBeArchivedError)
    })

    it("rejects converted inbox items", () => {
      const now = new Date("2026-05-11T12:00:00.000Z")
      const inboxItem = InboxItem.fromSnapshot({
        id: "inbox_123",
        userId: "user_123",
        rawContent: "Acheter du lait",
        status: "converted",
        convertedEntityType: "shopping",
        convertedEntityId: "shopping_456",
        createdAt: now,
        updatedAt: now,
        convertedAt: now
      })

      expect(() => inboxItem.archive()).toThrow(ConvertedItemCannotBeArchivedError)
    })
  })
})
