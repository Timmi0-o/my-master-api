import { BadRequestException } from '@nestjs/common';
import type { ErrorObject } from 'ajv';
import { ajv } from '@shared/presentation/http/ajv';
import { joinAppointmentChatPayloadSchema } from './schemas/join-appointment-chat-payload.schema';
import type { IJoinAppointmentChatPayload } from './schemas/join-appointment-chat-payload.types';

const validateJoinAppointmentChatPayloadCompiled = ajv.compile(
  joinAppointmentChatPayloadSchema,
);

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

export function validateJoinAppointmentChatPayload(
  raw: unknown,
  errorMessage: string,
): IJoinAppointmentChatPayload {
  if (!validateJoinAppointmentChatPayloadCompiled(raw)) {
    throw new BadRequestException({
      message: errorMessage,
      errors: formatErrorsForResponse(
        validateJoinAppointmentChatPayloadCompiled.errors,
      ),
    });
  }

  return raw as IJoinAppointmentChatPayload;
}
