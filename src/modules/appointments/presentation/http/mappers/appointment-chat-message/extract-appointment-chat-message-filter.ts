import type {
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { APPOINTMENT_CHAT_MESSAGE_STAFF_ONLY_FIELDS } from 'src/modules/appointments/domain/entities/appointment-chat-message/appointment-chat-message-select-fields';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IAppointmentChatMessageFiltersPreset } from '../../validation/types/appointment-chat-message-filters-preset.types';

export function extractAppointmentChatMessageFilter(
  filter: IAppointmentChatMessageFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<
      IAppointmentChatMessagePublicEntity,
      IAppointmentChatMessageRelations
    >
  | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(
    filter,
    isStaffUser,
    APPOINTMENT_CHAT_MESSAGE_STAFF_ONLY_FIELDS,
  );
  if (!sanitized) return undefined;

  const parts: WhereFilter<
    IAppointmentChatMessagePublicEntity,
    IAppointmentChatMessageRelations
  >[] = [];

  queryFilterBuildManager(parts, [
    {
      type: 'search',
      value: sanitized.search?.value,
      fieldsBySearch: ['body'],
      mode: sanitized.search?.mode,
    },
    { type: 'stringArray', field: 'id', value: sanitized.id },
    { type: 'stringArray', field: 'chatId', value: sanitized.chatId },
    {
      type: 'stringArray',
      field: 'senderUserId',
      value: sanitized.senderUserId,
    },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}
