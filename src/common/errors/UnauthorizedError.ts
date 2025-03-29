export class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string = "Unauthorized") {
    super(message);
    this.statusCode = 401;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
