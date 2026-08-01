import type { EmailMessages } from './email-messages.types';

export const emailMessagesEn: EmailMessages = {
  layout: {
    brandName: 'My Master',
    linkFallback: "If the button doesn't open, use this link:",
    footer: 'Booking service for professionals',
  },
  verification: {
    subject: 'Confirm your email — My Master',
    title: 'Confirm your email',
    intro:
      'One last step — confirm your address to start using your My Master account.',
    cta: 'Confirm email',
    expires: 'This link expires in 24 hours.',
    ignore: "If you didn't sign up, you can safely ignore this email.",
    textIntro:
      'Confirm your email for your My Master account. This link expires in 24 hours.',
    textLinkLabel: 'Open this link:',
  },
  passwordReset: {
    subject: 'Reset your password — My Master',
    title: 'Reset your password',
    intro: 'We received a request to change the password for your My Master account.',
    cta: 'Set a new password',
    expires: 'This link expires in 1 hour.',
    ignore:
      "If you didn't ask for this, ignore the email — your password won't change.",
    textIntro:
      'Password reset for your My Master account. This link expires in 1 hour.',
    textLinkLabel: 'Open this link:',
  },
};
