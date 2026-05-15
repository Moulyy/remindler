export abstract class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export abstract class BadRequestApiError extends ApiError {
  constructor(message: string, code: string) {
    super(message, 400, code)
  }
}
