import type { IUpdateMasterServiceApplicationInput } from 'src/modules/masters/application/dtos/master-service/update-master-service.input';
import type { IUpdateMasterServiceInput } from 'src/modules/masters/domain/entities/master-service';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { BadRequestException } from '@nestjs/common';
import type { IUpdateMasterServicePayload } from '../../validation/schemas/update-master-service-payload.types';
import { pickPatch } from '../shared/pick-patch.util';
import { toMasterActor } from '../shared/to-master-actor';

const PATCHABLE_KEYS = [
  'name',
  'description',
  'price',
  'durationMinutes',
  'category',
] as const satisfies readonly (keyof IUpdateMasterServiceInput)[];

export function payloadToUpdateMasterServiceInput(
  id: string,
  payload: IUpdateMasterServicePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUpdateMasterServiceApplicationInput {
  const patch = pickPatch(payload, PATCHABLE_KEYS);

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
