import { Injectable } from '@nestjs/common';
import { ajv } from 'src/modules/shared/presentation/http/validation/ajv-instance';
import { BaseValidator } from 'src/modules/shared/presentation/http/validation/base.validator';
import { joinAppointmentChatPayloadSchema } from './schemas/join-appointment-chat-payload.schema';
import type { IJoinAppointmentChatPayload } from './schemas/join-appointment-chat-payload.types';

const validateJoinAppointmentChatPayload = ajv.compile(
  joinAppointmentChatPayloadSchema,
);

@Injectable()
export class AppointmentChatWsValidator extends BaseValidator {
  validateJoinPayload(
    raw: Record<string, unknown>,
  ): IJoinAppointmentChatPayload {
    return this.validateAndReturn<IJoinAppointmentChatPayload>({
      validate: validateJoinAppointmentChatPayload,
      data: raw as unknown as IJoinAppointmentChatPayload,
      errorMessage: 'Некорректные данные для подключения к чату',
      logLabel: 'JoinAppointmentChatPayload',
      dataForSchema: raw,
    });
  }

  validateLeavePayload(
    raw: Record<string, unknown>,
  ): IJoinAppointmentChatPayload {
    return this.validateAndReturn<IJoinAppointmentChatPayload>({
      validate: validateJoinAppointmentChatPayload,
      data: raw as unknown as IJoinAppointmentChatPayload,
      errorMessage: 'Некорректные данные для выхода из чата',
      logLabel: 'LeaveAppointmentChatPayload',
      dataForSchema: raw,
    });
  }
}
