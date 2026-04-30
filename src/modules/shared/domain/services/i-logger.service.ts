export const ILoggerSymbol = Symbol('ILogger');

export interface ILoggerService {
  debug(message: string, context?: string): void;
  debug(message: string, metadata: string, context?: string): void;
  log(message: string, context?: string): void;
  log(message: string, metadata: string, context?: string): void;
  warn(message: string, context?: string): void;
  warn(message: string, metadata: string, context?: string): void;
  error(message: string, context?: string): void;
  error(message: string, metadata: string, context?: string): void;
  configuration(message: string, context?: string): void;
  configuration(message: string, metadata: string, context?: string): void;
}
