import { createHash } from "node:crypto"

import { PasswordHasher } from "@remindler/application"

export class UnsafeSha256PasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return createHash("sha256").update(password).digest("hex")
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return (await this.hash(password)) === hash
  }
}
