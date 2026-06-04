import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import { APPOINTMENT_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment/appointment-select-fields';
import type { IAppointmentChatPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type AppointmentSelectOptions = SelectOptions<
  IAppointmentPublicEntity,
  IAppointmentRelations
>;

const APPOINTMENT_PRESETS: Record<TPresetType, AppointmentSelectOptions> = {
  MINIMAL: {
    select: [
      'id',
      'masterProfileId',
      'masterServiceId',
      'clientUserId',
      'startsAt',
      'status',
    ],
  },
  SHORT: {
    select: [
      'id',
      'masterProfileId',
      'masterServiceId',
      'clientUserId',
      'startsAt',
      'durationMinutes',
      'status',
      'totalPrice',
      'serviceName',
      'createdAt',
      'updatedAt',
    ],
  },
  BASE: {
    select: [...APPOINTMENT_SELECT_FIELDS],
    include: {
      masterProfile: {
        select: [
          'id',
          'userId',
          'displayName',
          'description',
          'rating',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ] as (keyof IMasterProfilePublicEntity)[],
      },
      masterService: {
        select: [
          'id',
          'masterProfileId',
          'name',
          'description',
          'price',
          'durationMinutes',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ] as (keyof IMasterServicePublicEntity)[],
      },
      clientUser: {
        select: [
          'id',
          'email',
          'phone',
          'username',
          'role',
          'status',
          'language',
          'name',
          'surname',
          'patronymic',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ] as (keyof IUserPublicEntity)[],
      },
      chat: {
        select: [
          'id',
          'appointmentId',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ] as (keyof IAppointmentChatPublicEntity)[],
      },
    },
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IAppointmentPublicEntity, IAppointmentRelations> {
  const config = APPOINTMENT_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as AppointmentSelectOptions['select'],
    include: config.include,
  };
}
