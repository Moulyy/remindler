export type HouseTaskStatus = "todo" | "in_progress" | "done" | "cancelled" | "blocked"

export type HouseTaskPriority = "low" | "medium" | "high"

export type HouseTaskCategory =
  | "cleaning"
  | "shopping"
  | "admin"
  | "pet"
  | "health"
  | "maintenance"
  | "cooking"
  | "finance"
  | "other"

export type HouseTaskRecurrenceFrequency = "none" | "daily" | "weekly" | "monthly"

export type HouseTaskRecurrence = {
  frequency: HouseTaskRecurrenceFrequency
  interval?: number
}

export type HouseTaskSnapshot = {
  id: string
  houseId: string
  title: string
  description?: string
  status: HouseTaskStatus
  priority: HouseTaskPriority
  category: HouseTaskCategory
  assigneeIds: string[]
  dueDate?: Date
  recurrence?: HouseTaskRecurrence
  createdBy: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export type CreateHouseTaskInput = {
  id: string
  houseId: string
  title: string
  description?: string
  priority?: HouseTaskPriority
  category?: HouseTaskCategory
  assigneeIds?: string[]
  dueDate?: Date
  recurrence?: HouseTaskRecurrence
  createdBy: string
  createdAt?: Date
}
