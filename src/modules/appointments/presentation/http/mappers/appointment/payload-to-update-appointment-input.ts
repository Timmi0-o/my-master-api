import { BadRequestException } from '@nestjs/common';
import type { IUpdateAppointmentApplicationInput } from 'src/modules/appointments/application/dtos/appointment/update-appointment.input';
import type { IUpdateAppointmentInput } from 'src/modules/appointments/domain/entities/appointment';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IUpdateAppointmentPayload } from '../../validation/schemas/update-appointment-payload.types';
import { pickPatch } from '../shared/pick-patch.util';
import { toAppointmentActor } from '../shared/to-appointment-actor';

const PATCHABLE_KEYS = [
  'startsAt',
  'status',
  'cancelledAt',
  'cancelledBy',
  'cancelReason',
] as const satisfies readonly (keyof IUpdateAppointmentInput)[];

export function payloadToUpdateAppointmentInput(
  id: string,
  payload: IUpdateAppointmentPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUpdateAppointmentApplicationInput {
  const rawPatch = pickPatch(payload, PATCHABLE_KEYS);
  const patch: IUpdateAppointmentInput = {};

  if (rawPatch.startsAt !== undefined) {
    patch.startsAt = new Date(rawPatch.startsAt);
  }
  if (rawPatch.status !== undefined) {
    patch.status = rawPatch.status;
  }
  if (rawPatch.cancelledAt !== undefined) {
    patch.cancelledAt =
      rawPatch.cancelledAt === null ? null : new Date(rawPatch.cancelledAt);
  }
  if (rawPatch.cancelledBy !== undefined) {
    patch.cancelledBy = rawPatch.cancelledBy;
  }
  if (rawPatch.cancelReason !== undefined) {
    patch.cancelReason = rawPatch.cancelReason;
  }

  if (Object.keys(patch).length === 0) {
    throw new BadRequestException(
      'Update payload must contain at least one mutable field',
    );
  }

  return {
    id,
    patch,
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
