export type InboxItemType = "task" | "expense" | "shopping" | "idea" | "wishlist" | "home"

export type InboxItemStatus = "pending" | "converted" | "archived"

export type InboxItemSnapshot = {
  id: string
  userId: string
  rawContent: string
  status: InboxItemStatus
  convertedEntityType?: InboxItemType
  convertedEntityId?: string
  createdAt: Date
  updatedAt: Date
  convertedAt?: Date
}
