import { UserCredentials, UserCredentialsRepository } from "@remindler/application"

export class InMemoryUserCredentialsRepository implements UserCredentialsRepository {
  private readonly credentials = new Map<string, UserCredentials>()

  async save(credentials: UserCredentials): Promise<void> {
    this.credentials.set(credentials.userId, {
      ...credentials,
      createdAt: new Date(credentials.createdAt)
    })
  }
}
