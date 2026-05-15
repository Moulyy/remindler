import { DomainError } from "../../errors/domain-error"

export class EmptyUserIdError extends DomainError {
  constructor() {
    super("User ID cannot be empty.")
  }
}

export class EmptyUserEmailError extends DomainError {
  constructor() {
    super("User email cannot be empty.")
  }
}

export class InvalidUserEmailError extends DomainError {
  constructor() {
    super("User email must be valid.")
  }
}

export class EmptyUserDisplayNameError extends DomainError {
  constructor() {
    super("User display name cannot be empty.")
  }
}

export class InvalidUserCreatedAtError extends DomainError {
  constructor() {
    super("User creation date must be valid.")
  }
}
