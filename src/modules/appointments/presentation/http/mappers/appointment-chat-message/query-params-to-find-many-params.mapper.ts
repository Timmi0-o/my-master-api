import type {
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type { IGetAppointmentChatMessagesQueryPayload } from '../../validation/schemas/get-appointment-chat-messages-query.types';
import { extractAppointmentChatMessageFilter } from './extract-appointment-chat-message-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function queryParamsToFindManyParams(
  queryParams: IGetAppointmentChatMessagesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations
> {
  const filterWhere = extractAppointmentChatMessageFilter(
    queryParams.filter,
    metadata.isStaffUser,
  );
  const orderField = queryParams.orderField ?? 'id';
  const orderDir = queryParams.orderDir ?? 'asc';
  return {
    where: {
      ...(metadata.isStaffUser ? {} : { deletedAt: { isNull: true } }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({
      page: queryParams.page,
      limit: queryParams.limit,
    }),
    orderBy: mapOrderBy<IAppointmentChatMessagePublicEntity>({
      [orderField]: orderDir,
    }),
    ...splitPresetReadOptions(
      presetToSelectOptions(queryParams.preset, metadata.isStaffUser),
    ),
    requiredIds: queryParams.requiredIds,
  };
}
