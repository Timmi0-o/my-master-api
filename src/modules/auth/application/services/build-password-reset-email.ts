export function buildPasswordResetEmail(resetUrl: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = 'Сброс пароля';
  const text = [
    'Вы запросили сброс пароля.',
    '',
    `Перейдите по ссылке, чтобы задать новый пароль (действует 1 час):`,
    resetUrl,
    '',
    'Если вы не запрашивали сброс, просто проигнорируйте это письмо.',
  ].join('\n');

  const html = `
    <div style="font-family: sans-serif; line-height: 1.5; color: #111;">
      <h1 style="font-size: 20px;">Сброс пароля</h1>
      <p>Вы запросили сброс пароля.</p>
      <p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 999px;">
          Задать новый пароль
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">Ссылка действует 1 час.</p>
      <p style="color: #666; font-size: 14px;">Если вы не запрашивали сброс, проигнорируйте это письмо.</p>
      <p style="word-break: break-all; font-size: 12px; color: #999;">${resetUrl}</p>
    </div>
  `.trim();

  return { subject, html, text };
}
