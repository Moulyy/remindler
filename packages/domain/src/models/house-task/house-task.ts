import {
  cloneHouseTaskSnapshot,
  createHouseTaskSnapshot,
  normalizeAssigneeId,
  normalizeAssigneeIds
} from "./house-task.snapshot"
import { CreateHouseTaskInput, HouseTaskSnapshot, HouseTaskStatus } from "./house-task.types"
import {
  assertIsValidHouseTaskStatus,
  assertIsValidHouseTaskUpdatedAt
} from "./house-task.validators"

export class HouseTask {
  private constructor(private props: HouseTaskSnapshot) {}

  static create(input: CreateHouseTaskInput): HouseTask {
    const createdAt = input.createdAt ?? new Date()

    return new HouseTask(
      createHouseTaskSnapshot({
        id: input.id,
        houseId: input.houseId,
        title: input.title,
        description: input.description,
        status: "todo",
        priority: input.priority ?? "medium",
        category: input.category ?? "other",
        assigneeIds: input.assigneeIds ?? [],
        dueDate: input.dueDate,
        recurrence: input.recurrence,
        createdBy: input.createdBy,
        createdAt,
        updatedAt: createdAt
      })
    )
  }

  static fromSnapshot(snapshot: HouseTaskSnapshot): HouseTask {
    return new HouseTask(createHouseTaskSnapshot(snapshot))
  }

  public toSnapshot(): HouseTaskSnapshot {
    return cloneHouseTaskSnapshot(this.props)
  }

  public changeStatus(status: HouseTaskStatus, updatedAt: Date = new Date()): void {
    assertIsValidHouseTaskStatus(status)
    assertIsValidHouseTaskUpdatedAt(updatedAt)

    this.props = {
      ...this.props,
      status,
      updatedAt: new Date(updatedAt),
      completedAt: status === "done" ? new Date(updatedAt) : undefined
    }
  }

  public assignTo(userId: string, updatedAt: Date = new Date()): void {
    assertIsValidHouseTaskUpdatedAt(updatedAt)

    this.props = {
      ...this.props,
      assigneeIds: normalizeAssigneeIds([...this.props.assigneeIds, userId]),
      updatedAt: new Date(updatedAt)
    }
  }

  public unassignFrom(userId: string, updatedAt: Date = new Date()): void {
    const assigneeIdToRemove = normalizeAssigneeId(userId)
    assertIsValidHouseTaskUpdatedAt(updatedAt)

    this.props = {
      ...this.props,
      assigneeIds: this.props.assigneeIds.filter((assigneeId) => assigneeId !== assigneeIdToRemove),
      updatedAt: new Date(updatedAt)
    }
  }
}
