import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetMasterWeeklySchedulesOutput } from 'src/modules/masters/application/dtos/master-weekly-schedule/get-master-weekly-schedules.output';
import type { IGetMasterWeeklySchedulesQueryPayload } from '../validation/schemas/get-master-weekly-schedules-query.types';

export function mapGetMasterWeeklySchedulesHttpResponse(
  output: GetMasterWeeklySchedulesOutput,
  payload: IGetMasterWeeklySchedulesQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}
