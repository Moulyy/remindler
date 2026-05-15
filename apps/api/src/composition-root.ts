import { CreateHouseUseCase, LoginUserUseCase, RegisterUserUseCase } from "@remindler/application"

import { PrismaHouseMemberRepository } from "./adapters/prisma-house-member-repository"
import { PrismaHouseRepository } from "./adapters/prisma-house-repository"
import { PrismaUserCredentialsRepository } from "./adapters/prisma-user-credentials-repository"
import { PrismaUserRepository } from "./adapters/prisma-user-repository"
import { RandomIdGenerator } from "./adapters/random-id-generator"
import { SystemClock } from "./adapters/system-clock"
import { UnsafeSha256PasswordHasher } from "./adapters/unsafe-sha256-password-hasher"
import { createPrismaClient } from "./database/prisma-client"

export type AppDependencies = {
  createHouseUseCase: Pick<CreateHouseUseCase, "execute">
  loginUserUseCase: Pick<LoginUserUseCase, "execute">
  registerUserUseCase: Pick<RegisterUserUseCase, "execute">
}

export const createAppDependencies = (): AppDependencies => {
  const prisma = createPrismaClient()
  const idGenerator = new RandomIdGenerator()
  const clock = new SystemClock()
  const passwordHasher = new UnsafeSha256PasswordHasher()
  const houseRepository = new PrismaHouseRepository(prisma)
  const houseMemberRepository = new PrismaHouseMemberRepository(prisma)
  const userRepository = new PrismaUserRepository(prisma)
  const userCredentialsRepository = new PrismaUserCredentialsRepository(prisma)

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
