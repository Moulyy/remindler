import { assertIsNotEmpty } from "../../validation/assert-is-not-empty"
import { assertIsValidDate } from "../../validation/assert-is-valid-date"
import {
  EmptyHouseCreatedByError,
  EmptyHouseIdError,
  EmptyHouseNameError,
  InvalidHouseCreatedAtError
} from "./house.errors"
import { HouseSnapshot } from "./house.types"

export class House {
  private constructor(private props: HouseSnapshot) {}

  static create(
    id: HouseSnapshot["id"],
    name: HouseSnapshot["name"],
    createdBy: HouseSnapshot["createdBy"],
    createdAt: HouseSnapshot["createdAt"] = new Date()
  ): House {
    return new House(createHouseSnapshot(id, name, createdBy, createdAt))
  }

  static fromSnapshot(snapshot: HouseSnapshot): House {
    return new House(
      createHouseSnapshot(snapshot.id, snapshot.name, snapshot.createdBy, snapshot.createdAt)
    )
  }

  public toSnapshot(): HouseSnapshot {
    return {
      ...this.props,
      createdAt: new Date(this.props.createdAt)
    }
  }
}

const createHouseSnapshot = (
  id: HouseSnapshot["id"],
  name: HouseSnapshot["name"],
  createdBy: HouseSnapshot["createdBy"],
  createdAt: HouseSnapshot["createdAt"]
): HouseSnapshot => {
  assertIsNotEmpty(id, () => new EmptyHouseIdError())
  assertIsNotEmpty(name, () => new EmptyHouseNameError())
  assertIsNotEmpty(createdBy, () => new EmptyHouseCreatedByError())
  assertIsValidDate(createdAt, () => new InvalidHouseCreatedAtError())

  return {
    id: id.trim(),
    name: name.trim(),
    createdBy: createdBy.trim(),
    createdAt: new Date(createdAt)
  }
}
