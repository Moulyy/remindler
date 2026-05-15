import { DomainError } from "../../errors/domain-error"

export class EmptyHouseIdError extends DomainError {
  constructor() {
    super("House ID cannot be empty.")
  }
}

export class EmptyHouseNameError extends DomainError {
  constructor() {
    super("House name cannot be empty.")
  }
}

export class EmptyHouseCreatedByError extends DomainError {
  constructor() {
    super("House creator ID cannot be empty.")
  }
}

export class InvalidHouseCreatedAtError extends DomainError {
  constructor() {
    super("House creation date must be valid.")
  }
}
