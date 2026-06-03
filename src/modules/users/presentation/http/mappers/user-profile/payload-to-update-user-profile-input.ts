import { BadRequestException } from '@nestjs/common';
import type { IUpdateUserProfileApplicationInput } from 'src/modules/users/application/dtos/user-profile/update-user-profile.input';
import type { IUpdateUserProfileInput } from 'src/modules/users/domain/entities/user-profile';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IUpdateUserProfilePayload } from '../../validation/schemas/update-user-profile-payload.types';
import { pickPatch } from '../shared/pick-patch.util';
import { toUserActor } from '../shared/to-user-actor';

const PATCHABLE_KEYS = [
  'displayName',
  'rating',
  'userId',
] as const satisfies readonly (keyof IUpdateUserProfileInput)[];

export function payloadToUpdateUserProfileInput(
  id: string,
  payload: IUpdateUserProfilePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IUpdateUserProfileApplicationInput {
  const patch = pickPatch(payload, PATCHABLE_KEYS);

  if (Object.keys(patch).length === 0) {
    throw new BadRequestException(
      'Update payload must contain at least one mutable field',
    );
  }

  return {
    id,
    patch,
    actor: toUserActor(sessionUser, isStaffUser),
  };
}
