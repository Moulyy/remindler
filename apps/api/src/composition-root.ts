import { CreateHouseUseCase, LoginUserUseCase, RegisterUserUseCase } from "@remindler/application"

import { InMemoryHouseMemberRepository } from "./adapters/in-memory-house-member-repository"
import { InMemoryHouseRepository } from "./adapters/in-memory-house-repository"
import { InMemoryUserCredentialsRepository } from "./adapters/in-memory-user-credentials-repository"
import { InMemoryUserRepository } from "./adapters/in-memory-user-repository"
import { RandomIdGenerator } from "./adapters/random-id-generator"
import { SystemClock } from "./adapters/system-clock"
import { UnsafeSha256PasswordHasher } from "./adapters/unsafe-sha256-password-hasher"

export type AppDependencies = {
  createHouseUseCase: Pick<CreateHouseUseCase, "execute">
  loginUserUseCase: Pick<LoginUserUseCase, "execute">
  registerUserUseCase: Pick<RegisterUserUseCase, "execute">
}

export const createAppDependencies = (): AppDependencies => {
  const idGenerator = new RandomIdGenerator()
  const clock = new SystemClock()
  const passwordHasher = new UnsafeSha256PasswordHasher()
  const houseRepository = new InMemoryHouseRepository()
  const houseMemberRepository = new InMemoryHouseMemberRepository()
  const userRepository = new InMemoryUserRepository()
  const userCredentialsRepository = new InMemoryUserCredentialsRepository()

  return {
    createHouseUseCase: new CreateHouseUseCase(
      idGenerator,
      clock,
      houseRepository,
      houseMemberRepository
    ),
    registerUserUseCase: new RegisterUserUseCase(
      idGenerator,
      clock,
      passwordHasher,
      userRepository,
      userCredentialsRepository
    ),
    loginUserUseCase: new LoginUserUseCase(
      userRepository,
      userCredentialsRepository,
      passwordHasher
    )
  }
}
