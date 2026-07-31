export function buildVerificationEmail(verifyUrl: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = 'Подтверждение email';
  const text = [
    'Подтвердите email для аккаунта My Master.',
    '',
    `Перейдите по ссылке (действует 24 часа):`,
    verifyUrl,
    '',
    'Если вы не регистрировались, проигнорируйте это письмо.',
  ].join('\n');

  const html = `
    <div style="font-family: sans-serif; line-height: 1.5; color: #111;">
      <h1 style="font-size: 20px;">Подтверждение email</h1>
      <p>Подтвердите email для аккаунта My Master.</p>
      <p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 999px;">
          Подтвердить email
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">Ссылка действует 24 часа.</p>
      <p style="color: #666; font-size: 14px;">Если вы не регистрировались, проигнорируйте это письмо.</p>
      <p style="word-break: break-all; font-size: 12px; color: #999;">${verifyUrl}</p>
    </div>
  `.trim();

  return { subject, html, text };
}
