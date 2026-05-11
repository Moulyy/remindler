import { describe, expect, it } from "vitest"

import {
  ArchivedItemCannotBeClassifiedError,
  ConvertedItemCannotBeClassifiedError,
  EmptyInboxItemContentError,
  EmptyInboxItemIdError,
  EmptyInboxItemUserIdError
} from "../inbox-item.errors"
import { InboxItem } from "../inbox-item"

describe("InboxItem", () => {
  describe("create", () => {
    it("creates an unclassified inbox item", () => {
      const beforeCreate = new Date()

      const inboxItem = InboxItem.create("inbox_123", "user_123", "Acheter du lait")
      const afterCreate = new Date()
      const snapshot = inboxItem.toSnapshot()

      expect(snapshot).toMatchObject({
        id: "inbox_123",
        userId: "user_123",
        rawContent: "Acheter du lait",
        status: "unclassified"
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

  describe("classify", () => {
    it("classifies an unclassified inbox item", () => {
      const inboxItem = InboxItem.create("inbox_123", "user_123", "Acheter du lait")
      const beforeClassify = new Date()

      inboxItem.classify("shopping")

      const afterClassify = new Date()
      const snapshot = inboxItem.toSnapshot()

      expect(snapshot.status).toBe("classified")
      expect(snapshot.selectedType).toBe("shopping")
      expect(snapshot.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeClassify.getTime())
      expect(snapshot.updatedAt.getTime()).toBeLessThanOrEqual(afterClassify.getTime())
    })

    it("allows reclassifying a classified inbox item", () => {
      const inboxItem = InboxItem.create("inbox_123", "user_123", "Acheter du lait")

      inboxItem.classify("shopping")
      inboxItem.classify("task")

      expect(inboxItem.toSnapshot()).toMatchObject({
        status: "classified",
        selectedType: "task"
      })
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

      expect(() => inboxItem.classify("shopping")).toThrow(ArchivedItemCannotBeClassifiedError)
    })

    it("rejects converted inbox items", () => {
      const now = new Date("2026-05-11T12:00:00.000Z")
      const inboxItem = InboxItem.fromSnapshot({
        id: "inbox_123",
        userId: "user_123",
        rawContent: "Acheter du lait",
        selectedType: "shopping",
        status: "converted",
        convertedEntityType: "shopping",
        convertedEntityId: "shopping_456",
        createdAt: now,
        updatedAt: now,
        convertedAt: now
      })

      expect(() => inboxItem.classify("task")).toThrow(ConvertedItemCannotBeClassifiedError)
    })
  })
})
