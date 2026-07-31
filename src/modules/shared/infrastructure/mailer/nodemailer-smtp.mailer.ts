import { Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { IMailer, ISendMailInput } from '@shared/domain/mailer';
import type { ISmtpMailConfig } from './mail.config';

export class NodemailerSmtpMailer implements IMailer {
  private readonly logger = new Logger(NodemailerSmtpMailer.name);
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(config: ISmtpMailConfig) {
    this.from = config.from;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  async sendMail(input: ISendMailInput): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    this.logger.log(`Email sent to ${input.to}`);
  }
}
