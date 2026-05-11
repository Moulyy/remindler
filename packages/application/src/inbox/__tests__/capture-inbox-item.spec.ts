import { EmptyInboxItemContentError, InboxItem } from "@remindler/domain"
import { describe, expect, it } from "vitest"

import { CaptureInboxItemUseCase, IdGenerator, InboxItemRepository } from "../capture-inbox-item"

describe("CaptureInboxItemUseCase", () => {
  it("captures an inbox item", async () => {
    const { savedItems, useCase } = createTestContext()

    const output = await useCase.execute({
      userId: "user_123",
      rawContent: "Acheter du lait"
    })

    expect(output).toMatchObject({
      id: "inbox_123",
      userId: "user_123",
      rawContent: "Acheter du lait",
      status: "pending"
    })
    expect(savedItems).toHaveLength(1)
    expect(savedItems[0]?.toSnapshot()).toEqual(output)
  })

  it("propagates domain errors", async () => {
    const { useCase } = createTestContext()

    await expect(
      useCase.execute({
        userId: "user_123",
        rawContent: "   "
      })
    ).rejects.toThrow(EmptyInboxItemContentError)
  })
})

const createTestContext = () => {
  const savedItems: InboxItem[] = []
  const idGenerator: IdGenerator = {
    generate: () => "inbox_123"
  }
  const inboxItemRepository: InboxItemRepository = {
    save: async (item) => {
      savedItems.push(item)
    }
  }

  return {
    savedItems,
    useCase: new CaptureInboxItemUseCase(idGenerator, inboxItemRepository)
  }
}
