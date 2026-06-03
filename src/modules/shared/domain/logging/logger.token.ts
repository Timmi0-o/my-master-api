import type { ILoggerService } from '../services/i-logger.service';

export const LOGGER_TOKEN = Symbol('LOGGER_TOKEN');

export type ILogger = ILoggerService;
