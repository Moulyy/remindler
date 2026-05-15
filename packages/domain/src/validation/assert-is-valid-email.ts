import { DomainError } from "../errors/domain-error"

export const assertIsValidEmail = (value: string, createError: () => DomainError): void => {
  const normalizedValue = value.trim()
  const [localPart, domain, extraPart] = normalizedValue.split("@")

  if (
    extraPart !== undefined ||
    localPart === undefined ||
    domain === undefined ||
    localPart === "" ||
    domain === "" ||
    !domain.includes(".")
  ) {
    throw createError()
  }
}
