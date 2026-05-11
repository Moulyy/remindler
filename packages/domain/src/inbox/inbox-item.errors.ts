import { DomainError } from "../errors/domain-error"

export class EmptyInboxItemContentError extends DomainError {
  constructor() {
    super("Inbox item content cannot be empty.")
  }
}

export class EmptyInboxItemIdError extends DomainError {
  constructor() {
    super("Inbox item ID cannot be empty.")
  }
}

export class EmptyInboxItemUserIdError extends DomainError {
  constructor() {
    super("User ID cannot be empty.")
  }
}

export class InboxItemAlreadyConvertedError extends DomainError {
  constructor() {
    super("Inbox item has already been converted.")
  }
}

export class ArchivedItemCannotBeConvertedError extends DomainError {
  constructor() {
    super("Archived inbox items cannot be converted.")
  }
}

export class EmptyConvertedEntityIdError extends DomainError {
  constructor() {
    super("Converted entity ID cannot be empty.")
  }
}

export class ArchivedItemCannotBeArchivedError extends DomainError {
  constructor() {
    super("Inbox item is already archived.")
  }
}

export class ConvertedItemCannotBeArchivedError extends DomainError {
  constructor() {
    super("Converted inbox items cannot be archived.")
  }
}
