export type HouseMemberRole = "owner" | "admin" | "member"

export type HouseMemberSnapshot = {
  id: string
  houseId: string
  userId: string
  role: HouseMemberRole
  joinedAt: Date
}
