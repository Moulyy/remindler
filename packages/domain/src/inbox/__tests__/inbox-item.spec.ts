import { describe, expect, it } from "vitest"

import {
  EmptyInboxItemContentError,
  EmptyInboxItemIdError,
  EmptyInboxItemUserIdError,
  InvalidInboxItemDateError
} from "../inbox-item.errors"
import { InboxItem } from "../inbox-item"

describe("InboxItem", () => {
  describe("create", () => {
    it("creates an unclassified inbox item", () => {
      const now = new Date("2026-05-11T12:00:00.000Z")

      const inboxItem = InboxItem.create("inbox_123", "user_123", "Acheter du lait", now)

      expect(inboxItem.toSnapshot()).toEqual({
        id: "inbox_123",
        userId: "user_123",
        rawContent: "Acheter du lait",
        status: "unclassified",
        createdAt: now,
        updatedAt: now
      })
    })

    it("trims raw content", () => {
      const now = new Date("2026-05-11T12:00:00.000Z")

      const inboxItem = InboxItem.create("inbox_123", "user_123", "  Acheter du lait  ", now)

      expect(inboxItem.toSnapshot().rawContent).toBe("Acheter du lait")
    })

    it("rejects empty raw content", () => {
      const now = new Date("2026-05-11T12:00:00.000Z")

      expect(() => InboxItem.create("inbox_123", "user_123", "   ", now)).toThrow(
        EmptyInboxItemContentError
      )
    })

    it("rejects empty inbox item id", () => {
      const now = new Date("2026-05-11T12:00:00.000Z")

      expect(() => InboxItem.create("   ", "user_123", "Acheter du lait", now)).toThrow(
        EmptyInboxItemIdError
      )
    })

    it("rejects empty user id", () => {
      const now = new Date("2026-05-11T12:00:00.000Z")

      expect(() => InboxItem.create("inbox_123", "   ", "Acheter du lait", now)).toThrow(
        EmptyInboxItemUserIdError
      )
    })

    it("rejects invalid dates", () => {
      const now = new Date("invalid")

      expect(() => InboxItem.create("inbox_123", "user_123", "Acheter du lait", now)).toThrow(
        InvalidInboxItemDateError
      )
    })
  })
})
