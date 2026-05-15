import { assertIsNotEmpty } from "../../validation/assert-is-not-empty"
import { assertIsValidDate } from "../../validation/assert-is-valid-date"
import {
  EmptyHouseMemberHouseIdError,
  EmptyHouseMemberIdError,
  EmptyHouseMemberUserIdError,
  InvalidHouseMemberJoinedAtError,
  InvalidHouseMemberRoleError
} from "./house-member.errors"
import { HouseMemberRole, HouseMemberSnapshot } from "./house-member.types"

const houseMemberRoles = ["owner", "admin", "member"] as const satisfies HouseMemberRole[]

export class HouseMember {
  private constructor(private props: HouseMemberSnapshot) {}

  static create(
    id: HouseMemberSnapshot["id"],
    houseId: HouseMemberSnapshot["houseId"],
    userId: HouseMemberSnapshot["userId"],
    role: HouseMemberSnapshot["role"],
    joinedAt: HouseMemberSnapshot["joinedAt"] = new Date()
  ): HouseMember {
    return new HouseMember(createHouseMemberSnapshot(id, houseId, userId, role, joinedAt))
  }

  static fromSnapshot(snapshot: HouseMemberSnapshot): HouseMember {
    return new HouseMember(
      createHouseMemberSnapshot(
        snapshot.id,
        snapshot.houseId,
        snapshot.userId,
        snapshot.role,
        snapshot.joinedAt
      )
    )
  }

  public toSnapshot(): HouseMemberSnapshot {
    return {
      ...this.props,
      joinedAt: new Date(this.props.joinedAt)
    }
  }
}

const createHouseMemberSnapshot = (
  id: HouseMemberSnapshot["id"],
  houseId: HouseMemberSnapshot["houseId"],
  userId: HouseMemberSnapshot["userId"],
  role: HouseMemberSnapshot["role"],
  joinedAt: HouseMemberSnapshot["joinedAt"]
): HouseMemberSnapshot => {
  assertIsNotEmpty(id, () => new EmptyHouseMemberIdError())
  assertIsNotEmpty(houseId, () => new EmptyHouseMemberHouseIdError())
  assertIsNotEmpty(userId, () => new EmptyHouseMemberUserIdError())
  assertIsValidHouseMemberRole(role)
  assertIsValidDate(joinedAt, () => new InvalidHouseMemberJoinedAtError())

  return {
    id: id.trim(),
    houseId: houseId.trim(),
    userId: userId.trim(),
    role,
    joinedAt: new Date(joinedAt)
  }
}

const assertIsValidHouseMemberRole = (role: HouseMemberRole): void => {
  if (!houseMemberRoles.includes(role)) {
    throw new InvalidHouseMemberRoleError()
  }
}
