import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IAppointmentChatFiltersPreset } from '../../validation/types/appointment-chat-filters-preset.types';

export function extractAppointmentChatFilter(
  filter: IAppointmentChatFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IAppointmentChatPublicEntity, IAppointmentChatRelations> | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);
  if (!sanitized) return undefined;

  const parts: WhereFilter<IAppointmentChatPublicEntity, IAppointmentChatRelations>[] = [];
  const pushString = (
    field: keyof IAppointmentChatPublicEntity & string,
    value: IAppointmentChatFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IAppointmentChatPublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('appointmentId', sanitized.appointmentId);

  const pushDate = (
    field: keyof IAppointmentChatPublicEntity & string,
    value: IAppointmentChatFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IAppointmentChatPublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushDate('createdAt', sanitized.createdAt);
  pushDate('updatedAt', sanitized.updatedAt);
  pushDate('deletedAt', sanitized.deletedAt);

  if (!parts.length) return undefined;
  return parts.length === 1 ? parts[0] : { and: parts };
}
