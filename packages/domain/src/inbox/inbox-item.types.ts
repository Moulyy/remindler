export type InboxItemType = "task" | "expense" | "shopping" | "idea" | "wishlist" | "home"

export type InboxItemStatus = "unclassified" | "classified" | "converted" | "archived"

export type InboxItemSnapshot = {
  id: string
  userId: string
  rawContent: string
  selectedType?: InboxItemType
  status: InboxItemStatus
  convertedEntityType?: InboxItemType
  convertedEntityId?: string
  createdAt: Date
  updatedAt: Date
  convertedAt?: Date
}
