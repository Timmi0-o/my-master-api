import type { IGetNotificationByIdApplicationInput } from 'src/modules/notifications/application/dtos/notification/get-notification-by-id.input';
import type { IGetByIdQueryPayload } from '../../validation/schemas/get-by-id-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

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
      selectOptions: presetToSelectOptions(queryPayload.preset, isStaffUser),
    },
  };
}
