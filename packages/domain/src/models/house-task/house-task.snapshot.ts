import { assertIsNotEmpty } from "../../validation/assert-is-not-empty"
import { assertIsValidDate } from "../../validation/assert-is-valid-date"
import {
  EmptyHouseTaskAssigneeIdError,
  EmptyHouseTaskCreatedByError,
  EmptyHouseTaskHouseIdError,
  EmptyHouseTaskIdError,
  EmptyHouseTaskTitleError,
  InvalidHouseTaskCompletedAtError,
  InvalidHouseTaskCreatedAtError,
  InvalidHouseTaskDueDateError,
  InvalidHouseTaskUpdatedAtError
} from "./house-task.errors"
import { HouseTaskRecurrence, HouseTaskSnapshot } from "./house-task.types"
import {
  assertIsValidCompletion,
  assertIsValidHouseTaskCategory,
  assertIsValidHouseTaskPriority,
  assertIsValidHouseTaskRecurrenceFrequency,
  assertIsValidHouseTaskStatus,
  assertIsValidRecurrenceInterval
} from "./house-task.validators"

export const createHouseTaskSnapshot = (snapshot: HouseTaskSnapshot): HouseTaskSnapshot => {
  assertIsNotEmpty(snapshot.id, () => new EmptyHouseTaskIdError())
  assertIsNotEmpty(snapshot.houseId, () => new EmptyHouseTaskHouseIdError())
  assertIsNotEmpty(snapshot.title, () => new EmptyHouseTaskTitleError())
  assertIsNotEmpty(snapshot.createdBy, () => new EmptyHouseTaskCreatedByError())
  assertIsValidHouseTaskStatus(snapshot.status)
  assertIsValidHouseTaskPriority(snapshot.priority)
  assertIsValidHouseTaskCategory(snapshot.category)
  assertIsValidDate(snapshot.createdAt, () => new InvalidHouseTaskCreatedAtError())
  assertIsValidDate(snapshot.updatedAt, () => new InvalidHouseTaskUpdatedAtError())

  if (snapshot.dueDate !== undefined) {
    assertIsValidDate(snapshot.dueDate, () => new InvalidHouseTaskDueDateError())
  }

  if (snapshot.completedAt !== undefined) {
    assertIsValidDate(snapshot.completedAt, () => new InvalidHouseTaskCompletedAtError())
  }

  assertIsValidCompletion(snapshot.status, snapshot.completedAt)

  return {
    id: snapshot.id.trim(),
    houseId: snapshot.houseId.trim(),
    title: snapshot.title.trim(),
    description: normalizeOptionalText(snapshot.description),
    status: snapshot.status,
    priority: snapshot.priority,
    category: snapshot.category,
    assigneeIds: normalizeAssigneeIds(snapshot.assigneeIds),
    dueDate: cloneOptionalDate(snapshot.dueDate),
    recurrence: normalizeRecurrence(snapshot.recurrence),
    createdBy: snapshot.createdBy.trim(),
    createdAt: new Date(snapshot.createdAt),
    updatedAt: new Date(snapshot.updatedAt),
    completedAt: cloneOptionalDate(snapshot.completedAt)
  }
}

export const cloneHouseTaskSnapshot = (snapshot: HouseTaskSnapshot): HouseTaskSnapshot => ({
  ...snapshot,
  assigneeIds: [...snapshot.assigneeIds],
  dueDate: cloneOptionalDate(snapshot.dueDate),
  recurrence: cloneOptionalRecurrence(snapshot.recurrence),
  createdAt: new Date(snapshot.createdAt),
  updatedAt: new Date(snapshot.updatedAt),
  completedAt: cloneOptionalDate(snapshot.completedAt)
})

export const normalizeAssigneeIds = (assigneeIds: string[]): string[] => {
  return [...new Set(assigneeIds.map((assigneeId) => normalizeAssigneeId(assigneeId)))]
}

export const normalizeAssigneeId = (assigneeId: string): string => {
  assertIsNotEmpty(assigneeId, () => new EmptyHouseTaskAssigneeIdError())
  return assigneeId.trim()
}

const cloneOptionalDate = (date: Date | undefined): Date | undefined => {
  return date === undefined ? undefined : new Date(date)
}

const cloneOptionalRecurrence = (
  recurrence: HouseTaskRecurrence | undefined
): HouseTaskRecurrence | undefined => {
  return recurrence === undefined ? undefined : { ...recurrence }
}

const normalizeOptionalText = (value: string | undefined): string | undefined => {
  const normalizedValue = value?.trim()
  return normalizedValue === "" ? undefined : normalizedValue
}

const normalizeRecurrence = (
  recurrence: HouseTaskRecurrence | undefined
): HouseTaskRecurrence | undefined => {
  if (recurrence === undefined) {
    return undefined
  }

  assertIsValidHouseTaskRecurrenceFrequency(recurrence.frequency)

  if (recurrence.frequency === "none") {
    return { frequency: "none" }
  }

  const interval = recurrence.interval ?? 1
  assertIsValidRecurrenceInterval(interval)

  return {
    frequency: recurrence.frequency,
    interval
  }
}
