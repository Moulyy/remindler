import { UserRepository } from "@remindler/application"
import { User } from "@remindler/domain"

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>()

  async save(user: User): Promise<void> {
    this.users.set(user.toSnapshot().id, user)
  }
}
