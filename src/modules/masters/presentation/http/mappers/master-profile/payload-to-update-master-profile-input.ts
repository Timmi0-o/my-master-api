import type { IUpdateMasterProfileApplicationInput } from 'src/modules/masters/application/dtos/master-profile/update-master-profile.input';
import type { IUpdateMasterProfileInput } from 'src/modules/masters/domain/entities/master-profile';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { BadRequestException } from '@nestjs/common';
import type { IUpdateMasterProfilePayload } from '../../validation/schemas/update-master-profile-payload.types';
import { pickPatch } from '../shared/pick-patch.util';
import { toMasterActor } from '../shared/to-master-actor';

const PATCHABLE_KEYS = [
  'displayName',
  'description',
  'rating',
  'userId',
  'timezone',
  'bookingStatus',
  'minNoticeMinutes',
  'maxBookingDaysAhead',
  'slotStepMinutes',
  'bufferBetweenAppointmentsMinutes',
] as const satisfies readonly (keyof IUpdateMasterProfileInput)[];

export function payloadToUpdateMasterProfileInput(
  id: string,
  payload: IUpdateMasterProfilePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUpdateMasterProfileApplicationInput {
  const patch = pickPatch(payload, PATCHABLE_KEYS) as IUpdateMasterProfileInput;

  if (payload.pausedUntil !== undefined) {
    patch.pausedUntil =
      payload.pausedUntil === null ? null : new Date(payload.pausedUntil);
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
