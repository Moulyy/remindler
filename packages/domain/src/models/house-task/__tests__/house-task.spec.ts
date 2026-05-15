import { describe, expect, it } from "vitest"

import {
  EmptyHouseTaskAssigneeIdError,
  EmptyHouseTaskCreatedByError,
  EmptyHouseTaskHouseIdError,
  EmptyHouseTaskIdError,
  EmptyHouseTaskTitleError,
  HouseTask,
  InvalidHouseTaskCategoryError,
  InvalidHouseTaskDueDateError,
  InvalidHouseTaskPriorityError,
  InvalidHouseTaskRecurrenceFrequencyError,
  InvalidHouseTaskRecurrenceIntervalError,
  InvalidHouseTaskStatusError,
  InvalidHouseTaskUpdatedAtError,
  MissingHouseTaskCompletedAtError,
  UnexpectedHouseTaskCompletedAtError
} from "../index"
import type { HouseTaskSnapshot } from "../house-task.types"

describe("HouseTask", () => {
  it("creates a house task with default values", () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")

    const houseTask = HouseTask.create({
      id: "task_123",
      houseId: "house_123",
      title: "Sortir les poubelles",
      createdBy: "user_123",
      createdAt
    })

    expect(houseTask.toSnapshot()).toEqual({
      id: "task_123",
      houseId: "house_123",
      title: "Sortir les poubelles",
      status: "todo",
      priority: "medium",
      category: "other",
      assigneeIds: [],
      createdBy: "user_123",
      createdAt,
      updatedAt: createdAt
    })
  })

  it("creates a house task with optional values", () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")
    const dueDate = new Date("2026-05-13T08:00:00.000Z")

    const houseTask = HouseTask.create({
      id: "task_123",
      houseId: "house_123",
      title: "Appeler le vétérinaire",
      description: "Demander le rappel de vaccin",
      priority: "high",
      category: "pet",
      assigneeIds: ["user_123", "user_456"],
      dueDate,
      recurrence: { frequency: "weekly", interval: 2 },
      createdBy: "user_123",
      createdAt
    })

    expect(houseTask.toSnapshot()).toEqual({
      id: "task_123",
      houseId: "house_123",
      title: "Appeler le vétérinaire",
      description: "Demander le rappel de vaccin",
      status: "todo",
      priority: "high",
      category: "pet",
      assigneeIds: ["user_123", "user_456"],
      dueDate,
      recurrence: { frequency: "weekly", interval: 2 },
      createdBy: "user_123",
      createdAt,
      updatedAt: createdAt
    })
  })

  it("trims text fields and assignee ids", () => {
    const houseTask = HouseTask.create({
      id: "  task_123  ",
      houseId: "  house_123  ",
      title: "  Changer les draps  ",
      description: "   ",
      assigneeIds: ["  user_123  ", "user_123", "  user_456  "],
      createdBy: "  user_789  "
    })

    expect(houseTask.toSnapshot()).toMatchObject({
      id: "task_123",
      houseId: "house_123",
      title: "Changer les draps",
      description: undefined,
      assigneeIds: ["user_123", "user_456"],
      createdBy: "user_789"
    })
  })

  it("restores a done house task from a snapshot", () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")
    const updatedAt = new Date("2026-05-12T09:00:00.000Z")
    const completedAt = new Date("2026-05-12T09:00:00.000Z")

    const houseTask = HouseTask.fromSnapshot({
      id: "task_123",
      houseId: "house_123",
      title: "Payer une facture",
      status: "done",
      priority: "high",
      category: "finance",
      assigneeIds: ["user_123"],
      createdBy: "user_123",
      createdAt,
      updatedAt,
      completedAt
    })

    expect(houseTask.toSnapshot()).toEqual({
      id: "task_123",
      houseId: "house_123",
      title: "Payer une facture",
      status: "done",
      priority: "high",
      category: "finance",
      assigneeIds: ["user_123"],
      createdBy: "user_123",
      createdAt,
      updatedAt,
      completedAt
    })
  })

  it("protects mutable snapshot values from external mutation", () => {
    const createdAt = new Date("2026-05-12T08:00:00.000Z")
    const dueDate = new Date("2026-05-13T08:00:00.000Z")
    const houseTask = HouseTask.create({
      id: "task_123",
      houseId: "house_123",
      title: "Arroser les plantes",
      assigneeIds: ["user_123"],
      dueDate,
      recurrence: { frequency: "monthly", interval: 1 },
      createdBy: "user_123",
      createdAt
    })

    createdAt.setFullYear(2030)
    dueDate.setFullYear(2030)
    const snapshot = houseTask.toSnapshot()
    snapshot.assigneeIds.push("user_456")
    snapshot.dueDate?.setFullYear(2040)
    snapshot.recurrence!.interval = 12

    expect(houseTask.toSnapshot()).toMatchObject({
      assigneeIds: ["user_123"],
      dueDate: new Date("2026-05-13T08:00:00.000Z"),
      recurrence: { frequency: "monthly", interval: 1 },
      createdAt: new Date("2026-05-12T08:00:00.000Z")
    })
  })

  it("marks a task as done", () => {
    const updatedAt = new Date("2026-05-12T09:00:00.000Z")
    const houseTask = createTask()

    houseTask.changeStatus("done", updatedAt)

    expect(houseTask.toSnapshot()).toMatchObject({
      status: "done",
      updatedAt,
      completedAt: updatedAt
    })
  })

  it("clears completion date when reopening a task", () => {
    const houseTask = createTask()

    houseTask.changeStatus("done", new Date("2026-05-12T09:00:00.000Z"))
    houseTask.changeStatus("in_progress", new Date("2026-05-12T10:00:00.000Z"))

    expect(houseTask.toSnapshot()).toMatchObject({
      status: "in_progress",
      completedAt: undefined,
      updatedAt: new Date("2026-05-12T10:00:00.000Z")
    })
  })

  it("assigns and unassigns members", () => {
    const houseTask = createTask()

    houseTask.assignTo("  user_123  ", new Date("2026-05-12T09:00:00.000Z"))
    houseTask.assignTo("user_123", new Date("2026-05-12T10:00:00.000Z"))
    houseTask.assignTo("user_456", new Date("2026-05-12T11:00:00.000Z"))
    houseTask.unassignFrom("user_123", new Date("2026-05-12T12:00:00.000Z"))

    expect(houseTask.toSnapshot()).toMatchObject({
      assigneeIds: ["user_456"],
      updatedAt: new Date("2026-05-12T12:00:00.000Z")
    })
  })

  it("normalizes recurrence defaults", () => {
    const houseTask = HouseTask.create({
      id: "task_123",
      houseId: "house_123",
      title: "Sortir les poubelles",
      recurrence: { frequency: "weekly" },
      createdBy: "user_123"
    })

    expect(houseTask.toSnapshot().recurrence).toEqual({
      frequency: "weekly",
      interval: 1
    })
  })

  it("rejects empty required fields", () => {
    expect(() => createTask({ id: "   " })).toThrow(EmptyHouseTaskIdError)
    expect(() => createTask({ houseId: "   " })).toThrow(EmptyHouseTaskHouseIdError)
    expect(() => createTask({ title: "   " })).toThrow(EmptyHouseTaskTitleError)
    expect(() => createTask({ createdBy: "   " })).toThrow(EmptyHouseTaskCreatedByError)
  })

  it("rejects empty assignee ids", () => {
    expect(() => createTask({ assigneeIds: ["user_123", "   "] })).toThrow(
      EmptyHouseTaskAssigneeIdError
    )
  })

  it("rejects invalid dates", () => {
    expect(() => createTask({ dueDate: new Date("invalid") })).toThrow(InvalidHouseTaskDueDateError)

    expect(() => createTask().changeStatus("done", new Date("invalid"))).toThrow(
      InvalidHouseTaskUpdatedAtError
    )
  })

  it("rejects invalid status, priority, and category from snapshots", () => {
    expect(() => HouseTask.fromSnapshot(createSnapshot({ status: "invalid" }))).toThrow(
      InvalidHouseTaskStatusError
    )

    expect(() => HouseTask.fromSnapshot(createSnapshot({ priority: "invalid" }))).toThrow(
      InvalidHouseTaskPriorityError
    )

    expect(() => HouseTask.fromSnapshot(createSnapshot({ category: "invalid" }))).toThrow(
      InvalidHouseTaskCategoryError
    )
  })

  it("rejects inconsistent completion state", () => {
    expect(() => HouseTask.fromSnapshot(createSnapshot({ status: "done" }))).toThrow(
      MissingHouseTaskCompletedAtError
    )

    expect(() =>
      HouseTask.fromSnapshot(
        createSnapshot({
          completedAt: new Date("2026-05-12T09:00:00.000Z")
        })
      )
    ).toThrow(UnexpectedHouseTaskCompletedAtError)
  })

  it("rejects invalid recurrence", () => {
    expect(() =>
      HouseTask.fromSnapshot(
        createSnapshot({
          recurrence: { frequency: "invalid" }
        })
      )
    ).toThrow(InvalidHouseTaskRecurrenceFrequencyError)

    expect(() =>
      createTask({
        recurrence: { frequency: "weekly", interval: 0 }
      })
    ).toThrow(InvalidHouseTaskRecurrenceIntervalError)
  })
})

const createTask = (input: Partial<Parameters<typeof HouseTask.create>[0]> = {}): HouseTask => {
  return HouseTask.create({
    id: "task_123",
    houseId: "house_123",
    title: "Sortir les poubelles",
    createdBy: "user_123",
    createdAt: new Date("2026-05-12T08:00:00.000Z"),
    ...input
  })
}

const createSnapshot = (input: Record<string, unknown> = {}): HouseTaskSnapshot => {
  return {
    id: "task_123",
    houseId: "house_123",
    title: "Sortir les poubelles",
    status: "todo",
    priority: "medium",
    category: "other",
    assigneeIds: [],
    createdBy: "user_123",
    createdAt: new Date("2026-05-12T08:00:00.000Z"),
    updatedAt: new Date("2026-05-12T08:00:00.000Z"),
    ...input
  } as unknown as HouseTaskSnapshot
}
