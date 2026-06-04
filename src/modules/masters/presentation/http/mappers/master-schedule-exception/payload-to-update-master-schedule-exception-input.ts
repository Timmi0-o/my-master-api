import type { IUpdateMasterScheduleExceptionApplicationInput } from 'src/modules/masters/application/dtos/master-schedule-exception/update-master-schedule-exception.input';
import type { IUpdateMasterScheduleExceptionInput } from 'src/modules/masters/domain/entities/master-schedule-exception';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { BadRequestException } from '@nestjs/common';
import type { IUpdateMasterScheduleExceptionPayload } from '../../validation/schemas/update-master-schedule-exception-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToUpdateMasterScheduleExceptionInput(
  id: string,
  payload: IUpdateMasterScheduleExceptionPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUpdateMasterScheduleExceptionApplicationInput {
  const patch: IUpdateMasterScheduleExceptionInput = {};

  if (payload.startsAt !== undefined) {
    patch.startsAt = new Date(payload.startsAt);
  }
  if (payload.endsAt !== undefined) {
    patch.endsAt = new Date(payload.endsAt);
  }
  if (payload.kind !== undefined) {
    patch.kind = payload.kind;
  }
  if (payload.customStartTime !== undefined) {
    patch.customStartTime = payload.customStartTime;
  }
  if (payload.customEndTime !== undefined) {
    patch.customEndTime = payload.customEndTime;
  }
  if (payload.title !== undefined) {
    patch.title = payload.title;
  }
  if (payload.note !== undefined) {
    patch.note = payload.note;
  }

  if (Object.keys(patch).length === 0) {
    throw new BadRequestException(
      'Update payload must contain at least one mutable field',
    );
  }

  return {
    id,
    patch,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}
