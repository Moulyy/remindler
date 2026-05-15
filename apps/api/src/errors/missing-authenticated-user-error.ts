import { UnauthorizedApiError } from "./api-error"

export class MissingAuthenticatedUserError extends UnauthorizedApiError {
  constructor() {
    super("Authenticated user is required.", "MISSING_AUTHENTICATED_USER")
  }
}
