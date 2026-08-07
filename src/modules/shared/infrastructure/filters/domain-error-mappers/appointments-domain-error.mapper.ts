import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { DomainErrorMapper } from './domain-error-mapper.types';
import {
  AppointmentForbiddenError,
  AppointmentNotAvailableError,
  AppointmentNotCompletableError,
  AppointmentNotFoundError,
  AppointmentNotReschedulableError,
} from 'src/modules/appointments/domain/entities/appointment';
import {
  AppointmentChatForbiddenError,
  AppointmentChatNotFoundError,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import {
  AppointmentChatMessageForbiddenError,
  AppointmentChatMessageNotDeletableError,
  AppointmentChatMessageNotEditableError,
  AppointmentChatMessageNotFoundError,
  AppointmentChatMessageReplyTargetInvalidError,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { AppointmentChatMessageAttachmentInvalidError } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';

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
  if (
    error instanceof AppointmentNotAvailableError ||
    error instanceof AppointmentNotCompletableError ||
    error instanceof AppointmentNotReschedulableError ||
    error instanceof AppointmentChatMessageNotEditableError ||
    error instanceof AppointmentChatMessageNotDeletableError ||
    error instanceof AppointmentChatMessageAttachmentInvalidError ||
    error instanceof AppointmentChatMessageReplyTargetInvalidError
  ) {
    return new ConflictException(error.message);
  }
  return null;
};
