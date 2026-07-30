import type { IGetNotificationByIdApplicationInput } from 'src/modules/notifications/application/dtos/notification/get-notification-by-id.input';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function payloadToGetNotificationByIdInput(
  id: string,
  queryPayload: IGetByIdQueryPayload,
  isStaffUser: boolean,
  actorUserId: string,
): IGetNotificationByIdApplicationInput {
  return {
    id,
    isStaffUser,
    actorUserId,
    params: {
      ...splitPresetReadOptions(presetToSelectOptions(queryPayload.preset, isStaffUser)),
    },
  };
}
