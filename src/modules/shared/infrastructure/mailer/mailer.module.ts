import { Module } from '@nestjs/common';
import { MAILER_TOKEN } from '@shared/domain/mailer';
import { ConsoleMailer } from './console.mailer';
import { loadSmtpMailConfig } from './mail.config';
import { NodemailerSmtpMailer } from './nodemailer-smtp.mailer';

@Module({
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
  ],
  exports: [MAILER_TOKEN],
})
export class MailerModule {}
