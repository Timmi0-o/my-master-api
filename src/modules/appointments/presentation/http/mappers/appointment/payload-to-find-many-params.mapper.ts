import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IGetAppointmentsQueryPayload } from '../../validation/schemas/get-appointments-query.types';
import { extractAppointmentFilter } from './extract-appointment-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToFindManyParams(
  payload: IGetAppointmentsQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IAppointmentPublicEntity, IAppointmentRelations> {
  const filterWhere = extractAppointmentFilter(
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
    slice: mapPaginationToSlice({
      page: payload.page,
      limit: payload.limit,
    }),
    orderBy: mapOrderBy<IAppointmentPublicEntity>({ [orderField]: orderDir }),
    selectOptions: presetToSelectOptions(payload.preset, metadata.isStaffUser),
    requiredIds: payload.requiredIds,
  };
}
