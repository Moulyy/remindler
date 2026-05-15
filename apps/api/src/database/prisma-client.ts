import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "../generated/prisma/client"

export type PrismaDatabaseClient = PrismaClient

export const createPrismaClient = (): PrismaDatabaseClient => {
  const databaseUrl = process.env.DATABASE_URL

  if (databaseUrl === undefined) {
    throw new Error("DATABASE_URL must be defined.")
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl })
  })
}
