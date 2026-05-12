import { RegisterUserUseCase } from "@remindler/application"

import { InMemoryUserCredentialsRepository } from "./adapters/in-memory-user-credentials-repository"
import { InMemoryUserRepository } from "./adapters/in-memory-user-repository"
import { RandomIdGenerator } from "./adapters/random-id-generator"
import { SystemClock } from "./adapters/system-clock"
import { UnsafeSha256PasswordHasher } from "./adapters/unsafe-sha256-password-hasher"

export type AppDependencies = {
  registerUserUseCase: Pick<RegisterUserUseCase, "execute">
}

export const createAppDependencies = (): AppDependencies => {
  const idGenerator = new RandomIdGenerator()
  const clock = new SystemClock()
  const passwordHasher = new UnsafeSha256PasswordHasher()
  const userRepository = new InMemoryUserRepository()
  const userCredentialsRepository = new InMemoryUserCredentialsRepository()

  return {
    registerUserUseCase: new RegisterUserUseCase(
      idGenerator,
      clock,
      passwordHasher,
      userRepository,
      userCredentialsRepository
    )
  }
}
