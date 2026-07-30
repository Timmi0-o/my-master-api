import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type { IGetAppointmentChatsQueryPayload } from '../../validation/schemas/get-appointment-chats-query.types';
import { extractAppointmentChatFilter } from './extract-appointment-chat-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToFindManyParams(
  payload: IGetAppointmentChatsQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IAppointmentChatPublicEntity, IAppointmentChatRelations> {
  const filterWhere = extractAppointmentChatFilter(
    payload.filter,
    metadata.isStaffUser,
  );
  const orderField = payload.orderField ?? 'id';
  const orderDir = payload.orderDir ?? 'asc';
  return {
    where: {
      ...(metadata.isStaffUser ? {} : { deletedAt: { isNull: true } }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({ page: payload.page, limit: payload.limit }),
    orderBy: mapOrderBy<IAppointmentChatPublicEntity>({
      [orderField]: orderDir,
    }),
    ...splitPresetReadOptions(
      presetToSelectOptions(payload.preset, metadata.isStaffUser),
    ),
    requiredIds: payload.requiredIds,
  };
}
