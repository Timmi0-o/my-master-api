import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import { APPOINTMENT_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment/appointment-select-fields';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type AppointmentPresetOptions = PresetReadOptions<
  IAppointmentPublicEntity,
  IAppointmentRelations
>;

const AVATAR_INCLUDE = {
  avatar: true as const,
} as const;

const CLIENT_USER_PROFILE_AVATAR_INCLUDE = {
  userProfile: {
    select: ['id', 'userId', 'displayName'] as const,
  },
} as const;

const APPOINTMENT_PRESETS: Record<TPresetType, AppointmentPresetOptions> = {
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
        include: AVATAR_INCLUDE,
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
          'roleId',
          'status',
          'language',
          'name',
          'surname',
          'patronymic',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ] as (keyof IUserPublicEntity)[],
        include: CLIENT_USER_PROFILE_AVATAR_INCLUDE,
      },
      chat: {
        include: {
          messages: {
            select: [
              'id',
              'chatId',
              'senderUserId',
              'actor',
              'body',
              'createdAt',
              'updatedAt',
              'deletedAt',
            ],
          },
        },
      },
    },
    enrich: { personalNotes: true },
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): PresetReadOptions<IAppointmentPublicEntity, IAppointmentRelations> {
  const config = APPOINTMENT_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as AppointmentPresetOptions['select'],
    include: config.include,
    enrich: config.enrich,
  };
}
