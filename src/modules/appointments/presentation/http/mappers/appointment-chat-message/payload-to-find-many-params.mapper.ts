import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IGetAppointmentChatMessagesQueryPayload } from '../../validation/schemas/get-appointment-chat-messages-query.types';
import { extractAppointmentChatMessageFilter } from './extract-appointment-chat-message-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToFindManyParams(
  payload: IGetAppointmentChatMessagesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IAppointmentChatMessagePublicEntity, IAppointmentChatMessageRelations> {
  const filterWhere = extractAppointmentChatMessageFilter(payload.filter, metadata.isStaffUser);
  const orderField = payload.orderField ?? 'id';
  const orderDir = payload.orderDir ?? 'asc';
  return {
    where: {
      ...(metadata.isStaffUser ? {} : { deletedAt: { isNull: true } }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({ page: payload.page, limit: payload.limit }),
    orderBy: mapOrderBy<IAppointmentChatMessagePublicEntity>({ [orderField]: orderDir }),
    selectOptions: presetToSelectOptions(payload.preset, metadata.isStaffUser),
    requiredIds: payload.requiredIds,
  };
}
