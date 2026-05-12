import { assertIsNotEmpty } from "../../validation/assert-is-not-empty"
import { assertIsValidDate } from "../../validation/assert-is-valid-date"
import { assertIsValidEmail } from "../../validation/assert-is-valid-email"
import {
  EmptyUserDisplayNameError,
  EmptyUserEmailError,
  EmptyUserIdError,
  InvalidUserCreatedAtError,
  InvalidUserEmailError
} from "./user.errors"
import { UserSnapshot } from "./user.types"

export class User {
  private constructor(private props: UserSnapshot) {}

  static create(
    id: UserSnapshot["id"],
    email: UserSnapshot["email"],
    displayName: UserSnapshot["displayName"],
    createdAt: UserSnapshot["createdAt"] = new Date()
  ): User {
    return new User(createUserSnapshot(id, email, displayName, createdAt))
  }

  static fromSnapshot(snapshot: UserSnapshot): User {
    return new User(
      createUserSnapshot(snapshot.id, snapshot.email, snapshot.displayName, snapshot.createdAt)
    )
  }

  public toSnapshot(): UserSnapshot {
    return {
      ...this.props,
      createdAt: new Date(this.props.createdAt)
    }
  }
}

const createUserSnapshot = (
  id: UserSnapshot["id"],
  email: UserSnapshot["email"],
  displayName: UserSnapshot["displayName"],
  createdAt: UserSnapshot["createdAt"]
): UserSnapshot => {
  assertIsNotEmpty(id, () => new EmptyUserIdError())
  assertIsNotEmpty(email, () => new EmptyUserEmailError())
  assertIsValidEmail(email, () => new InvalidUserEmailError())
  assertIsNotEmpty(displayName, () => new EmptyUserDisplayNameError())
  assertIsValidDate(createdAt, () => new InvalidUserCreatedAtError())

  return {
    id: id.trim(),
    email: email.trim().toLowerCase(),
    displayName: displayName.trim(),
    createdAt: new Date(createdAt)
  }
}
