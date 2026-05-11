import { assertIsNotEmpty } from "../validation/assert-is-not-empty"
import {
  ArchivedItemCannotBeArchivedError,
  ArchivedItemCannotBeConvertedError,
  ConvertedItemCannotBeArchivedError,
  EmptyConvertedEntityIdError,
  EmptyInboxItemContentError,
  EmptyInboxItemIdError,
  EmptyInboxItemUserIdError,
  InboxItemAlreadyConvertedError
} from "./inbox-item.errors"
import { InboxItemSnapshot, InboxItemType } from "./inbox-item.types"

export class InboxItem {
  private constructor(private props: InboxItemSnapshot) {}

  public toSnapshot(): InboxItemSnapshot {
    return { ...this.props }
  }

  static fromSnapshot(snapshot: InboxItemSnapshot): InboxItem {
    return new InboxItem(snapshot)
  }

  static create(
    id: InboxItemSnapshot["id"],
    userId: InboxItemSnapshot["userId"],
    rawContent: InboxItemSnapshot["rawContent"]
  ): InboxItem {
    validateCreateInboxItemInput(id, userId, rawContent)
    const now = new Date()

    return new InboxItem({
      id,
      userId,
      rawContent: rawContent.trim(),
      status: "pending",
      createdAt: now,
      updatedAt: now
    })
  }

  convert(entityId: string, entityType: InboxItemType): void {
    assertIsNotEmpty(entityId, () => new EmptyConvertedEntityIdError())

    if (this.props.status === "converted") {
      throw new InboxItemAlreadyConvertedError()
    }

    if (this.props.status === "archived") {
      throw new ArchivedItemCannotBeConvertedError()
    }

    const now = new Date()

    this.props = {
      ...this.props,
      status: "converted",
      convertedEntityId: entityId.trim(),
      convertedEntityType: entityType,
      convertedAt: now,
      updatedAt: now
    }
  }

  archive(): void {
    if (this.props.status === "archived") {
      throw new ArchivedItemCannotBeArchivedError()
    }
    if (this.props.status === "converted") {
      throw new ConvertedItemCannotBeArchivedError()
    }

    this.props = {
      ...this.props,
      status: "archived",
      updatedAt: new Date()
    }
  }
}

const validateCreateInboxItemInput = (
  id: InboxItemSnapshot["id"],
  userId: InboxItemSnapshot["userId"],
  rawContent: InboxItemSnapshot["rawContent"]
) => {
  assertIsNotEmpty(rawContent, () => new EmptyInboxItemContentError())
  assertIsNotEmpty(id, () => new EmptyInboxItemIdError())
  assertIsNotEmpty(userId, () => new EmptyInboxItemUserIdError())
}
