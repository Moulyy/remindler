import { InboxItem, InboxItemSnapshot } from "@remindler/domain"

export type IdGenerator = {
  generate(): string
}

export type CaptureInboxItemInput = {
  userId: string
  rawContent: string
}

export type InboxItemRepository = {
  save(item: InboxItem): Promise<void>
}

export class CaptureInboxItemUseCase {
  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly inboxItemRepository: InboxItemRepository
  ) {}

  async execute(input: CaptureInboxItemInput): Promise<InboxItemSnapshot> {
    const inboxItem = InboxItem.create(this.idGenerator.generate(), input.userId, input.rawContent)
    await this.inboxItemRepository.save(inboxItem)
    return inboxItem.toSnapshot()
  }
}
