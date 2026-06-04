import type {
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapSearchByFields,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IAppointmentChatMessageFiltersPreset } from '../../validation/types/appointment-chat-message-filters-preset.types';

export function extractAppointmentChatMessageFilter(
  filter: IAppointmentChatMessageFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IAppointmentChatMessagePublicEntity, IAppointmentChatMessageRelations> | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);
  if (!sanitized) return undefined;

  const parts: WhereFilter<IAppointmentChatMessagePublicEntity, IAppointmentChatMessageRelations>[] = [];

  if (sanitized.search?.value) {
    const part = mapSearchByFields<IAppointmentChatMessagePublicEntity>(
      sanitized.search.value,
      ['body'],
      sanitized.search.mode ?? 'PARTIAL',
    );
    if (part) parts.push(part);
  }

  const pushString = (
    field: keyof IAppointmentChatMessagePublicEntity & string,
    value: IAppointmentChatMessageFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IAppointmentChatMessagePublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('chatId', sanitized.chatId);
  pushString('senderUserId', sanitized.senderUserId);

  const pushDate = (
    field: keyof IAppointmentChatMessagePublicEntity & string,
    value: IAppointmentChatMessageFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IAppointmentChatMessagePublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushDate('createdAt', sanitized.createdAt);
  pushDate('updatedAt', sanitized.updatedAt);
  pushDate('deletedAt', sanitized.deletedAt);

  if (!parts.length) return undefined;
  return parts.length === 1 ? parts[0] : { and: parts };
}
