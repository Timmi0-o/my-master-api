import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/request-mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';
import { APPOINTMENT_STAFF_ONLY_FIELDS } from 'src/modules/appointments/domain/entities/appointment/appointment-select-fields';
import type { IAppointmentFiltersPreset } from '../../validation/types/appointment-filters-preset.types';

export function extractAppointmentFilter(
  filter: IAppointmentFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IAppointmentPublicEntity, IAppointmentRelations> | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, APPOINTMENT_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<IAppointmentPublicEntity, IAppointmentRelations>[] =
    [];

  queryFilterBuildManager(parts, [
    {
      type: 'search',
      value: sanitized.search?.value,
      fieldsBySearch: ['serviceName'],
      mode: sanitized.search?.mode,
    },
    { type: 'stringArray', field: 'id', value: sanitized.id },
    {
      type: 'stringArray',
      field: 'masterProfileId',
      value: sanitized.masterProfileId,
    },
    {
      type: 'stringArray',
      field: 'masterServiceId',
      value: sanitized.masterServiceId,
    },
    {
      type: 'stringArray',
      field: 'clientUserId',
      value: sanitized.clientUserId,
    },
    {
      type: 'stringArray',
      field: 'status',
      value: sanitized.status as IAppointmentFiltersPreset['id'],
    },
    { type: 'dateRange', field: 'startsAt', value: sanitized.startsAt },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}
