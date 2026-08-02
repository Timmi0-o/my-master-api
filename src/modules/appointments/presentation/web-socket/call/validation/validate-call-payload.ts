import { BadRequestException } from '@nestjs/common';
import type { ErrorObject } from 'ajv';
import { ajv } from '@shared/presentation/http/ajv';
import {
  callAnswerPayloadSchema,
  callIcePayloadSchema,
  callIdPayloadSchema,
  callOfferPayloadSchema,
  inviteCallPayloadSchema,
} from './schemas/call-payload.schemas';
import type {
  ICallAnswerPayload,
  ICallIcePayload,
  ICallIdPayload,
  ICallOfferPayload,
  IInviteCallPayload,
} from './schemas/call-payload.types';

function formatErrorsForResponse(
  errors: ErrorObject[] | null | undefined,
): Array<Record<string, unknown>> {
  if (!errors?.length) {
    return [];
  }

  return errors.map((error) => ({
    instancePath: error.instancePath,
    schemaPath: error.schemaPath,
    keyword: error.keyword,
    message: error.message,
    params: error.params,
  }));
}

function validateWithSchema<T>(
  compiled: { (data: unknown): boolean; errors?: ErrorObject[] | null },
  raw: unknown,
  errorMessage: string,
): T {
  if (!compiled(raw)) {
    throw new BadRequestException({
      message: errorMessage,
      errors: formatErrorsForResponse(compiled.errors),
    });
  }

  return raw as T;
}

const validateInviteCompiled = ajv.compile(inviteCallPayloadSchema);
const validateCallIdCompiled = ajv.compile(callIdPayloadSchema);
const validateOfferCompiled = ajv.compile(callOfferPayloadSchema);
const validateAnswerCompiled = ajv.compile(callAnswerPayloadSchema);
const validateIceCompiled = ajv.compile(callIcePayloadSchema);

export function validateInviteCallPayload(
  raw: unknown,
  errorMessage = 'Некорректные данные для звонка',
): IInviteCallPayload {
  return validateWithSchema<IInviteCallPayload>(
    validateInviteCompiled,
    raw,
    errorMessage,
  );
}

export function validateCallIdPayload(
  raw: unknown,
  errorMessage = 'Некорректный идентификатор звонка',
): ICallIdPayload {
  return validateWithSchema<ICallIdPayload>(
    validateCallIdCompiled,
    raw,
    errorMessage,
  );
}

export function validateCallOfferPayload(
  raw: unknown,
  errorMessage = 'Некорректный SDP offer',
): ICallOfferPayload {
  return validateWithSchema<ICallOfferPayload>(
    validateOfferCompiled,
    raw,
    errorMessage,
  );
}

export function validateCallAnswerPayload(
  raw: unknown,
  errorMessage = 'Некорректный SDP answer',
): ICallAnswerPayload {
  return validateWithSchema<ICallAnswerPayload>(
    validateAnswerCompiled,
    raw,
    errorMessage,
  );
}

export function validateCallIcePayload(
  raw: unknown,
  errorMessage = 'Некорректный ICE candidate',
): ICallIcePayload {
  return validateWithSchema<ICallIcePayload>(
    validateIceCompiled,
    raw,
    errorMessage,
  );
}
