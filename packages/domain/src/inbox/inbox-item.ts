import {
  ArchivedItemCannotBeClassifiedError,
  ConvertedItemCannotBeClassifiedError,
  EmptyInboxItemContentError,
  EmptyInboxItemIdError,
  EmptyInboxItemUserIdError
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
      status: "unclassified",
      createdAt: now,
      updatedAt: now
    })
  }

  classify(type: InboxItemType): void {
    if (this.props.status === "archived") {
      throw new ArchivedItemCannotBeClassifiedError()
    }

    if (this.props.status === "converted") {
      throw new ConvertedItemCannotBeClassifiedError()
    }

    this.props = {
      ...this.props,
      selectedType: type,
      status: "classified",
      updatedAt: new Date()
    }
  }
}

const validateCreateInboxItemInput = (
  id: InboxItemSnapshot["id"],
  userId: InboxItemSnapshot["userId"],
  rawContent: InboxItemSnapshot["rawContent"]
) => {
  if (rawContent.trim() === "") {
    throw new EmptyInboxItemContentError()
  }

  if (id.trim() === "") {
    throw new EmptyInboxItemIdError()
  }

  if (userId.trim() === "") {
    throw new EmptyInboxItemUserIdError()
  }
}
