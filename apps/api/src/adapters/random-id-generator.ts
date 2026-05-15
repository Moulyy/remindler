import { randomUUID } from "node:crypto"

import { IdGenerator } from "@remindler/application"

export class RandomIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID()
  }
}
