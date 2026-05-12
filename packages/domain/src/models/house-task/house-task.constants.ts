import {
  HouseTaskCategory,
  HouseTaskPriority,
  HouseTaskRecurrenceFrequency,
  HouseTaskStatus
} from "./house-task.types"

export const houseTaskStatuses = [
  "todo",
  "in_progress",
  "done",
  "cancelled",
  "blocked"
] as const satisfies HouseTaskStatus[]

export const houseTaskPriorities = ["low", "medium", "high"] as const satisfies HouseTaskPriority[]

export const houseTaskCategories = [
  "cleaning",
  "shopping",
  "admin",
  "pet",
  "health",
  "maintenance",
  "cooking",
  "finance",
  "other"
] as const satisfies HouseTaskCategory[]

export const houseTaskRecurrenceFrequencies = [
  "none",
  "daily",
  "weekly",
  "monthly"
] as const satisfies HouseTaskRecurrenceFrequency[]
