import { UnauthorizedApiError } from "./api-error"

export class UnauthenticatedError extends UnauthorizedApiError {
  constructor() {
    super("Authentication is required.", "UNAUTHENTICATED")
  }
}
