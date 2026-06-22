import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { DomainErrorMapper } from './domain-error-mapper.types';
import {
  AppointmentForbiddenError,
  AppointmentNotFoundError,
} from 'src/modules/appointments/domain/entities/appointment';
import {
  AppointmentChatForbiddenError,
  AppointmentChatNotFoundError,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import {
  AppointmentChatMessageForbiddenError,
  AppointmentChatMessageNotFoundError,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';

export const mapAppointmentsDomainError: DomainErrorMapper = (error) => {
  if (
    error instanceof AppointmentNotFoundError ||
    error instanceof AppointmentChatNotFoundError ||
    error instanceof AppointmentChatMessageNotFoundError
  ) {
    return new NotFoundException(error.message);
  }
  if (
    error instanceof AppointmentForbiddenError ||
    error instanceof AppointmentChatForbiddenError ||
    error instanceof AppointmentChatMessageForbiddenError
  ) {
    return new ForbiddenException(error.message);
  }
  return null;
};
