import { DomainError } from "@/errors/domain-error"

export const assertIsNotEmpty = (value: string, createError: () => DomainError): void => {
  if (value.trim() === "") {
    throw createError()
  }
}
