import { assertIsValidDate } from "../../validation/assert-is-valid-date"
import {
  houseTaskCategories,
  houseTaskPriorities,
  houseTaskRecurrenceFrequencies,
  houseTaskStatuses
} from "./house-task.constants"
import {
  InvalidHouseTaskCategoryError,
  InvalidHouseTaskPriorityError,
  InvalidHouseTaskRecurrenceFrequencyError,
  InvalidHouseTaskRecurrenceIntervalError,
  InvalidHouseTaskStatusError,
  InvalidHouseTaskUpdatedAtError,
  MissingHouseTaskCompletedAtError,
  UnexpectedHouseTaskCompletedAtError
} from "./house-task.errors"
import {
  HouseTaskCategory,
  HouseTaskPriority,
  HouseTaskRecurrenceFrequency,
  HouseTaskStatus
} from "./house-task.types"

export const assertIsValidHouseTaskStatus = (status: HouseTaskStatus): void => {
  if (!houseTaskStatuses.includes(status)) {
    throw new InvalidHouseTaskStatusError()
  }
}

export const assertIsValidHouseTaskPriority = (priority: HouseTaskPriority): void => {
  if (!houseTaskPriorities.includes(priority)) {
    throw new InvalidHouseTaskPriorityError()
  }
}

export const assertIsValidHouseTaskCategory = (category: HouseTaskCategory): void => {
  if (!houseTaskCategories.includes(category)) {
    throw new InvalidHouseTaskCategoryError()
  }
}

export const assertIsValidHouseTaskRecurrenceFrequency = (
  frequency: HouseTaskRecurrenceFrequency
): void => {
  if (!houseTaskRecurrenceFrequencies.includes(frequency)) {
    throw new InvalidHouseTaskRecurrenceFrequencyError()
  }
}

export const assertIsValidRecurrenceInterval = (interval: number): void => {
  if (!Number.isInteger(interval) || interval < 1) {
    throw new InvalidHouseTaskRecurrenceIntervalError()
  }
}

export const assertIsValidHouseTaskUpdatedAt = (updatedAt: Date): void => {
  assertIsValidDate(updatedAt, () => new InvalidHouseTaskUpdatedAtError())
}

export const assertIsValidCompletion = (
  status: HouseTaskStatus,
  completedAt: Date | undefined
): void => {
  if (status === "done" && completedAt === undefined) {
    throw new MissingHouseTaskCompletedAtError()
  }

  if (status !== "done" && completedAt !== undefined) {
    throw new UnexpectedHouseTaskCompletedAtError()
  }
}
