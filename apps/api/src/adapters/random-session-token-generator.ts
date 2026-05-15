import { randomBytes } from "node:crypto"

import { SessionTokenGenerator } from "@remindler/application"

export class RandomSessionTokenGenerator implements SessionTokenGenerator {
  generate(): string {
    return randomBytes(32).toString("base64url")
  }
}
