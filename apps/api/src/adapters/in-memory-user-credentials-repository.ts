import { UserCredentials, UserCredentialsRepository } from "@remindler/application"

export class InMemoryUserCredentialsRepository implements UserCredentialsRepository {
  private readonly credentials = new Map<string, UserCredentials>()

  async findByUserId(userId: string): Promise<UserCredentials | undefined> {
    const credentials = this.credentials.get(userId)

    if (credentials === undefined) {
      return undefined
    }

    return {
      ...credentials,
      createdAt: new Date(credentials.createdAt)
    }
  }

  async save(credentials: UserCredentials): Promise<void> {
    this.credentials.set(credentials.userId, {
      ...credentials,
      createdAt: new Date(credentials.createdAt)
    })
  }
}
