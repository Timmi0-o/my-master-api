import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetMasterScheduleExceptionsOutput } from 'src/modules/masters/application/dtos/master-schedule-exception/get-master-schedule-exceptions.output';
import type { IGetMasterScheduleExceptionsQueryPayload } from '../validation/schemas/get-master-schedule-exceptions-query.types';

export function mapGetMasterScheduleExceptionsHttpResponse(
  output: GetMasterScheduleExceptionsOutput,
  payload: IGetMasterScheduleExceptionsQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}
