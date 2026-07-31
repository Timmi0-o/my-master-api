export interface ISmtpMailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export function loadSmtpMailConfig(): ISmtpMailConfig | null {
  const host = process.env.MAIL_HOST?.trim();
  const portRaw = process.env.MAIL_PORT?.trim();
  const user = process.env.MAIL_USER?.trim();
  const pass = process.env.MAIL_PASS?.trim();
  const from = process.env.MAIL_FROM?.trim();

  if (!host || !user || !pass || !from) {
    return null;
  }

  const port = Number(portRaw ?? '587');
  if (!Number.isFinite(port) || port <= 0) {
    return null;
  }

  return { host, port, user, pass, from };
}

export function loadAppWebUrl(): string {
  const url = process.env.APP_WEB_URL?.trim() || 'http://localhost:3000';
  return url.replace(/\/$/, '');
}
