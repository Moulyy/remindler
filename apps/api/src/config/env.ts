export const getRequiredEnv = (name: string): string => {
  const value = process.env[name]

  if (value === undefined || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const getRequiredBooleanEnv = (name: string): boolean => {
  const value = getRequiredEnv(name)

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  throw new Error(`Environment variable ${name} must be "true" or "false".`)
}

export const assertNodeEnvIsValid = (): void => {
  getNodeEnv()
}

export const isProductionEnv = (): boolean => {
  return getNodeEnv() === "production"
}

const getNodeEnv = (): "development" | "test" | "production" => {
  const value = getRequiredEnv("NODE_ENV")

  if (value === "production") {
    return value
  }

  if (value === "development" || value === "test") {
    return value
  }

  throw new Error('Environment variable NODE_ENV must be "development", "test", or "production".')
}
