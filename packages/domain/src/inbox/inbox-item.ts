import {
  EmptyInboxItemContentError,
  EmptyInboxItemIdError,
  EmptyInboxItemUserIdError,
  InvalidInboxItemDateError
} from "./inbox-item.errors"
import { InboxItemSnapshot } from "./inbox-item.types"

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
    rawContent: InboxItemSnapshot["rawContent"],
    now: InboxItemSnapshot["createdAt"]
  ): InboxItem {
    validateCreateInboxItemInput(id, userId, rawContent, now)
    return new InboxItem({
      id,
      userId,
      rawContent: rawContent.trim(),
      status: "unclassified",
      createdAt: now,
      updatedAt: now
    })
  }
}

const validateCreateInboxItemInput = (
  id: InboxItemSnapshot["id"],
  userId: InboxItemSnapshot["userId"],
  rawContent: InboxItemSnapshot["rawContent"],
  now: InboxItemSnapshot["createdAt"]
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

  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new InvalidInboxItemDateError()
  }
}
