import { Module } from '@nestjs/common';
import { MAILER_TOKEN } from '@shared/domain/mailer';
import { TemplatingModule } from '@shared/infrastructure/templating/templating.module';
import { ConsoleMailer } from './console.mailer';
import { EmailMessageFactory } from './email-message.factory';
import { loadSmtpMailConfig } from './mail.config';
import { NodemailerSmtpMailer } from './nodemailer-smtp.mailer';

@Module({
  imports: [TemplatingModule],
  providers: [
    {
      provide: MAILER_TOKEN,
      useFactory: () => {
        const smtp = loadSmtpMailConfig();
        if (smtp) {
          return new NodemailerSmtpMailer(smtp);
        }
        return new ConsoleMailer();
      },
    },
    EmailMessageFactory,
  ],
  exports: [MAILER_TOKEN, EmailMessageFactory],
})
export class MailerModule {}
