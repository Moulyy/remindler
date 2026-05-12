import { DomainError } from "../errors/domain-error"

export const assertIsValidDate = (value: Date, createError: () => DomainError): void => {
  if (Number.isNaN(value.getTime())) {
    throw createError()
  }
}
