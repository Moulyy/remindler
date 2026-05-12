import { DomainError } from "../../errors/domain-error"

export class EmptyHouseTaskIdError extends DomainError {
  constructor() {
    super("House task ID cannot be empty.")
  }
}

export class EmptyHouseTaskHouseIdError extends DomainError {
  constructor() {
    super("House task house ID cannot be empty.")
  }
}

export class EmptyHouseTaskTitleError extends DomainError {
  constructor() {
    super("House task title cannot be empty.")
  }
}

export class EmptyHouseTaskCreatedByError extends DomainError {
  constructor() {
    super("House task creator ID cannot be empty.")
  }
}

export class EmptyHouseTaskAssigneeIdError extends DomainError {
  constructor() {
    super("House task assignee ID cannot be empty.")
  }
}

export class InvalidHouseTaskStatusError extends DomainError {
  constructor() {
    super("House task status must be valid.")
  }
}

export class InvalidHouseTaskPriorityError extends DomainError {
  constructor() {
    super("House task priority must be valid.")
  }
}

export class InvalidHouseTaskCategoryError extends DomainError {
  constructor() {
    super("House task category must be valid.")
  }
}

export class InvalidHouseTaskDueDateError extends DomainError {
  constructor() {
    super("House task due date must be valid.")
  }
}

export class InvalidHouseTaskCreatedAtError extends DomainError {
  constructor() {
    super("House task creation date must be valid.")
  }
}

export class InvalidHouseTaskUpdatedAtError extends DomainError {
  constructor() {
    super("House task update date must be valid.")
  }
}

export class InvalidHouseTaskCompletedAtError extends DomainError {
  constructor() {
    super("House task completion date must be valid.")
  }
}

export class MissingHouseTaskCompletedAtError extends DomainError {
  constructor() {
    super("Done house tasks must have a completion date.")
  }
}

export class UnexpectedHouseTaskCompletedAtError extends DomainError {
  constructor() {
    super("Only done house tasks can have a completion date.")
  }
}

export class InvalidHouseTaskRecurrenceFrequencyError extends DomainError {
  constructor() {
    super("House task recurrence frequency must be valid.")
  }
}

export class InvalidHouseTaskRecurrenceIntervalError extends DomainError {
  constructor() {
    super("House task recurrence interval must be a positive integer.")
  }
}
