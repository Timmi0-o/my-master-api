import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import { APPOINTMENT_CHAT_STAFF_ONLY_FIELDS } from 'src/modules/appointments/domain/entities/appointment-chat/appointment-chat-select-fields';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/request-mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';
import type { IAppointmentChatFiltersPreset } from '../../validation/types/appointment-chat-filters-preset.types';

export function extractAppointmentChatFilter(
  filter: IAppointmentChatFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<IAppointmentChatPublicEntity, IAppointmentChatRelations>
  | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(
    filter,
    isStaffUser,
    APPOINTMENT_CHAT_STAFF_ONLY_FIELDS,
  );
  if (!sanitized) return undefined;

  const parts: WhereFilter<
    IAppointmentChatPublicEntity,
    IAppointmentChatRelations
  >[] = [];

  queryFilterBuildManager(parts, [
    { type: 'stringArray', field: 'id', value: sanitized.id },
    {
      type: 'stringArray',
      field: 'masterProfileId',
      value: sanitized.masterProfileId,
    },
    {
      type: 'stringArray',
      field: 'clientUserId',
      value: sanitized.clientUserId,
    },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}
