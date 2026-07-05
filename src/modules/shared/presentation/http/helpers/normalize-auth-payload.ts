import type { Request } from 'express';
import type { ILoginMetadataInput } from '@modules/auth/presentation/http/validation/schemas/auth.schema.types';
import { loginMetadataSchema } from '@modules/auth/presentation/http/validation/schemas/login-metadata.schema';
import { ajv } from '../ajv';

const validateLoginMetadata = ajv.compile(loginMetadataSchema);

export function buildLoginMetadataInput(req: Request): ILoginMetadataInput {
  const payload: ILoginMetadataInput = {
    ipAddress: req.ip ?? null,
    userAgent: req.headers['user-agent'] ?? null,
  };

  if (!validateLoginMetadata(payload)) {
    throw new Error('Invalid login metadata');
  }

  return payload;
}

export function normalizeRegisterPayload(raw: unknown): {
  email: string;
  username: string;
  password: string;
} {
  const record =
    typeof raw === 'object' && raw !== null && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  return {
    email: typeof record.email === 'string' ? record.email.trim() : '',
    username: typeof record.username === 'string' ? record.username.trim() : '',
    password: String(record.password ?? ''),
  };
}

export function normalizeAuthCredentials(raw: unknown): {
  email: string;
  password: string;
} {
  const record =
    typeof raw === 'object' && raw !== null && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  return {
    email: typeof record.email === 'string' ? record.email.trim() : '',
    password: String(record.password ?? ''),
  };
}
