import type { EmailMessages } from './email-messages.types';

export const emailMessagesRu: EmailMessages = {
  layout: {
    brandName: 'My Master',
    linkFallback: 'Если кнопка не открывается, перейдите по ссылке:',
    footer: 'Сервис записи к мастерам',
  },
  verification: {
    subject: 'Подтверждение email — My Master',
    title: 'Подтвердите email',
    intro:
      'Остался один шаг — подтвердите адрес, чтобы пользоваться аккаунтом My Master.',
    cta: 'Подтвердить email',
    expires: 'Ссылка действует 24 часа.',
    ignore: 'Если вы не регистрировались, просто проигнорируйте это письмо.',
    textIntro:
      'Подтвердите email для аккаунта My Master. Ссылка действует 24 часа.',
    textLinkLabel: 'Открыть ссылку:',
  },
  passwordReset: {
    subject: 'Сброс пароля — My Master',
    title: 'Сброс пароля',
    intro: 'Мы получили запрос на смену пароля для вашего аккаунта My Master.',
    cta: 'Задать новый пароль',
    expires: 'Ссылка действует 1 час.',
    ignore: 'Если это были не вы, просто проигнорируйте письмо — пароль не изменится.',
    textIntro: 'Сброс пароля для аккаунта My Master. Ссылка действует 1 час.',
    textLinkLabel: 'Открыть ссылку:',
  },
};
