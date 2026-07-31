export interface ISendMailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface IMailer {
  sendMail(input: ISendMailInput): Promise<void>;
}
