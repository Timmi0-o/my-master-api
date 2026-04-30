import { Injectable, Logger } from '@nestjs/common';
import { ILoggerService } from '../../domain/services/i-logger.service';

@Injectable()
export class LoggerService implements ILoggerService {
  private readonly logger = new Logger('App');

  debug(message: string, context?: string): void;
  debug(message: string, metadata: string, context?: string): void;
  debug(message: string, metadataOrContext?: string, context?: string): void {
    this.logger.debug(this.formatMessage(message, metadataOrContext, context));
  }

  log(message: string, context?: string): void;
  log(message: string, metadata: string, context?: string): void;
  log(message: string, metadataOrContext?: string, context?: string): void {
    this.logger.log(this.formatMessage(message, metadataOrContext, context));
  }

  warn(message: string, context?: string): void;
  warn(message: string, metadata: string, context?: string): void;
  warn(message: string, metadataOrContext?: string, context?: string): void {
    this.logger.warn(this.formatMessage(message, metadataOrContext, context));
  }

  error(message: string, context?: string): void;
  error(message: string, metadata: string, context?: string): void;
  error(message: string, metadataOrContext?: string, context?: string): void {
    this.logger.error(this.formatMessage(message, metadataOrContext, context));
  }

  configuration(message: string, context?: string): void;
  configuration(message: string, metadata: string, context?: string): void;
  configuration(
    message: string,
    metadataOrContext?: string,
    context?: string,
  ): void {
    this.logger.log(
      this.formatMessage(`[CONFIG] ${message}`, metadataOrContext, context),
    );
  }

  private formatMessage(
    message: string,
    metadataOrContext?: string,
    context?: string,
  ): string {
    const metadata = context !== undefined ? metadataOrContext : undefined;
    const actualContext = context !== undefined ? context : metadataOrContext;
    const contextPrefix = actualContext ? `[${actualContext}] ` : '';

    if (!metadata) {
      return `${contextPrefix}${message}`;
    }

    return `${contextPrefix}${message}\n${this.formatMetadata(metadata)}`;
  }

  private formatMetadata(metadata: string): string {
    try {
      const parsed = JSON.parse(metadata) as unknown;
      const pretty = JSON.stringify(parsed, null, 2);
      return `metadata:\n${pretty}`;
    } catch {
      return `metadata: ${metadata}`;
    }
  }
}
