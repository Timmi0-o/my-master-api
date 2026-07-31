import { Logger } from '@nestjs/common';
import type { IMailer, ISendMailInput } from '@shared/domain/mailer';

export class ConsoleMailer implements IMailer {
  private readonly logger = new Logger(ConsoleMailer.name);

  async sendMail(input: ISendMailInput): Promise<void> {
    this.logger.log(
      `[ConsoleMailer] to=${input.to} subject=${input.subject}\n${input.text}`,
    );
  }
}
