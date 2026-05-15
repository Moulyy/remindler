import { DomainError } from "../../errors/domain-error"

export class EmptyHouseMemberIdError extends DomainError {
  constructor() {
    super("House member ID cannot be empty.")
  }
}

export class EmptyHouseMemberHouseIdError extends DomainError {
  constructor() {
    super("House member house ID cannot be empty.")
  }
}

export class EmptyHouseMemberUserIdError extends DomainError {
  constructor() {
    super("House member user ID cannot be empty.")
  }
}

export class InvalidHouseMemberRoleError extends DomainError {
  constructor() {
    super("House member role must be valid.")
  }
}

export class InvalidHouseMemberJoinedAtError extends DomainError {
  constructor() {
    super("House member join date must be valid.")
  }
}
