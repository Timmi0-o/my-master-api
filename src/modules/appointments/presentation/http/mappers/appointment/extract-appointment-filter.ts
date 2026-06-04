import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapSearchByFields,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IAppointmentFiltersPreset } from '../../validation/types/appointment-filters-preset.types';

export function extractAppointmentFilter(
  filter: IAppointmentFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IAppointmentPublicEntity, IAppointmentRelations> | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<IAppointmentPublicEntity, IAppointmentRelations>[] =
    [];

  if (sanitized.search?.value) {
    const part = mapSearchByFields<IAppointmentPublicEntity>(
      sanitized.search.value,
      ['serviceName'],
      sanitized.search.mode ?? 'PARTIAL',
    );
    if (part) parts.push(part);
  }

  const pushString = (
    field: keyof IAppointmentPublicEntity & string,
    value: IAppointmentFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IAppointmentPublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('masterProfileId', sanitized.masterProfileId);
  pushString('masterServiceId', sanitized.masterServiceId);
  pushString('clientUserId', sanitized.clientUserId);
  pushString('status', sanitized.status as IAppointmentFiltersPreset['id']);

  const pushDate = (
    field: keyof IAppointmentPublicEntity & string,
    value: IAppointmentFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IAppointmentPublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushDate('startsAt', sanitized.startsAt);
  pushDate('createdAt', sanitized.createdAt);
  pushDate('updatedAt', sanitized.updatedAt);
  pushDate('deletedAt', sanitized.deletedAt);

  if (!parts.length) {
    return undefined;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return { and: parts };
}
