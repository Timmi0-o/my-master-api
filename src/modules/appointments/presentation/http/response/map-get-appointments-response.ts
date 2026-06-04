import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetAppointmentsOutput } from 'src/modules/appointments/application/dtos/appointment/get-appointments.output';
import type { IGetAppointmentsQueryPayload } from '../validation/schemas/get-appointments-query.types';

export function mapGetAppointmentsHttpResponse(
  output: GetAppointmentsOutput,
  payload: IGetAppointmentsQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}
