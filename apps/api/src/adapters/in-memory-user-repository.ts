import { UserRepository } from "@remindler/application"
import { User } from "@remindler/domain"

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>()

  async findByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.trim().toLowerCase()
    return [...this.users.values()].find((user) => user.toSnapshot().email === normalizedEmail)
  }

  async save(user: User): Promise<void> {
    this.users.set(user.toSnapshot().id, user)
  }
}
