import { Inject, Injectable } from '@nestjs/common';
import { languageToCatalogLocale } from '@shared/domain/i18n/user-language.helpers';
import {
  TEMPLATE_RENDERER_TOKEN,
  type ITemplateRenderer,
} from '@shared/domain/templating';
import {
  EMAIL_MESSAGE_CATALOGS,
  type EmailActionMessages,
} from '@shared/infrastructure/i18n/emails';
import { resolveCatalogMessages } from '@shared/infrastructure/i18n/load-catalog-messages';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';
import { loadAppWebUrl } from './mail.config';

export type BuiltEmailMessage = {
  subject: string;
  html: string;
  text: string;
};

@Injectable()
export class EmailMessageFactory {
  constructor(
    @Inject(TEMPLATE_RENDERER_TOKEN)
    private readonly templateRenderer: ITemplateRenderer,
  ) {}

  buildVerification(input: {
    language: EUserLanguage;
    verifyUrl: string;
  }): BuiltEmailMessage {
    return this.buildActionEmail({
      language: input.language,
      actionUrl: input.verifyUrl,
      resolveMessages: (messages) => messages.verification,
    });
  }

  buildPasswordReset(input: {
    language: EUserLanguage;
    resetUrl: string;
  }): BuiltEmailMessage {
    return this.buildActionEmail({
      language: input.language,
      actionUrl: input.resetUrl,
      resolveMessages: (messages) => messages.passwordReset,
    });
  }

  private buildActionEmail(input: {
    language: EUserLanguage;
    actionUrl: string;
    resolveMessages: (
      catalog: (typeof EMAIL_MESSAGE_CATALOGS)[keyof typeof EMAIL_MESSAGE_CATALOGS],
    ) => EmailActionMessages;
  }): BuiltEmailMessage {
    const catalog = resolveCatalogMessages(
      EMAIL_MESSAGE_CATALOGS,
      input.language,
    );
    const messages = input.resolveMessages(catalog);
    const layout = catalog.layout;
    const appWebUrl = loadAppWebUrl();

    const bodyHtml = this.templateRenderer.renderFile(
      'emails/transactional-action.hbs',
      {
        title: messages.title,
        intro: messages.intro,
        cta: messages.cta,
        expires: messages.expires,
        ignore: messages.ignore,
        linkFallback: layout.linkFallback,
        actionUrl: input.actionUrl,
      },
    );

    const html = this.templateRenderer.renderFile('emails/layouts/base.hbs', {
      body: bodyHtml,
      brandName: layout.brandName,
      brandLogoUrl: `${appWebUrl}/icons/icon-192.png`,
      footer: layout.footer,
      preheader: messages.intro,
      lang: languageToCatalogLocale(input.language),
      year: new Date().getFullYear(),
    });

    const text = [
      messages.textIntro,
      '',
      messages.textLinkLabel,
      input.actionUrl,
      '',
      messages.ignore,
    ].join('\n');

    return { subject: messages.subject, html, text };
  }
}
