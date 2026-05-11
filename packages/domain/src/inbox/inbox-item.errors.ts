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

export class ArchivedItemCannotBeClassifiedError extends DomainError {
  constructor() {
    super("Archived inbox item cannot be classified.")
  }
}

export class ConvertedItemCannotBeClassifiedError extends DomainError {
  constructor() {
    super("Converted inbox item cannot be classified.")
  }
}
