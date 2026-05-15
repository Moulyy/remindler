import { BadRequestApiError } from "./api-error"

export class MissingAuthenticatedUserError extends BadRequestApiError {
  constructor() {
    super("Authenticated user is required.", "MISSING_AUTHENTICATED_USER")
  }
}
