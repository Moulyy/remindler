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

export class InvalidInboxItemDateError extends DomainError {
  constructor() {
    super("Inbox item date must be valid.")
  }
}
