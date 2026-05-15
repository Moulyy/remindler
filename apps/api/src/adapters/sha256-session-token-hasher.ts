import { createHash } from "node:crypto"

import { SessionTokenHasher } from "@remindler/application"

export class Sha256SessionTokenHasher implements SessionTokenHasher {
  async hash(token: string): Promise<string> {
    return createHash("sha256").update(token).digest("hex")
  }
}
