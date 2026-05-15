import {
  AuthenticateUserUseCase,
  CreateHouseUseCase,
  GetAuthenticatedUserUseCase,
  LoginUserUseCase,
  RegisterUserUseCase
} from "@remindler/application"

import { PrismaHouseMemberRepository } from "./adapters/prisma-house-member-repository"
import { PrismaHouseRepository } from "./adapters/prisma-house-repository"
import { PrismaUserCredentialsRepository } from "./adapters/prisma-user-credentials-repository"
import { PrismaUserRepository } from "./adapters/prisma-user-repository"
import { PrismaUserSessionRepository } from "./adapters/prisma-user-session-repository"
import { RandomIdGenerator } from "./adapters/random-id-generator"
import { RandomSessionTokenGenerator } from "./adapters/random-session-token-generator"
import { Sha256SessionTokenHasher } from "./adapters/sha256-session-token-hasher"
import { SystemClock } from "./adapters/system-clock"
import { UnsafeSha256PasswordHasher } from "./adapters/unsafe-sha256-password-hasher"
import { createPrismaClient } from "./database/prisma-client"

export type AppDependencies = {
  authenticateUserUseCase: Pick<AuthenticateUserUseCase, "execute">
  createHouseUseCase: Pick<CreateHouseUseCase, "execute">
  getAuthenticatedUserUseCase: Pick<GetAuthenticatedUserUseCase, "execute">
  loginUserUseCase: Pick<LoginUserUseCase, "execute">
  registerUserUseCase: Pick<RegisterUserUseCase, "execute">
}

export const createAppDependencies = (): AppDependencies => {
  const prisma = createPrismaClient()
  const idGenerator = new RandomIdGenerator()
  const clock = new SystemClock()
  const passwordHasher = new UnsafeSha256PasswordHasher()
  const sessionTokenGenerator = new RandomSessionTokenGenerator()
  const sessionTokenHasher = new Sha256SessionTokenHasher()
  const houseRepository = new PrismaHouseRepository(prisma)
  const houseMemberRepository = new PrismaHouseMemberRepository(prisma)
  const userRepository = new PrismaUserRepository(prisma)
  const userCredentialsRepository = new PrismaUserCredentialsRepository(prisma)
  const userSessionRepository = new PrismaUserSessionRepository(prisma)

  return {
    authenticateUserUseCase: new AuthenticateUserUseCase(
      clock,
      sessionTokenHasher,
      userSessionRepository
    ),
    createHouseUseCase: new CreateHouseUseCase(
      idGenerator,
      clock,
      houseRepository,
      houseMemberRepository
    ),
    getAuthenticatedUserUseCase: new GetAuthenticatedUserUseCase(userRepository),
    registerUserUseCase: new RegisterUserUseCase(
      idGenerator,
      clock,
      passwordHasher,
      userRepository,
      userCredentialsRepository
    ),
    loginUserUseCase: new LoginUserUseCase(
      idGenerator,
      clock,
      userRepository,
      userCredentialsRepository,
      passwordHasher,
      sessionTokenGenerator,
      sessionTokenHasher,
      userSessionRepository
    )
  }
}
