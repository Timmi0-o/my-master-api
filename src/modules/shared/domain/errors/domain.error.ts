export abstract class DomainError extends Error {
  public readonly code: string;
  public readonly context?: Readonly<Record<string, unknown>>;

  constructor(code: string, message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context ? Object.freeze({ ...context }) : undefined;
  }
}
