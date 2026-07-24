import type { GetAppointmentsOutput } from 'src/modules/appointments/application/dtos/appointment/get-appointments.output';
import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { IGetAppointmentsQueryPayload } from '../validation/schemas/get-appointments-query.types';
import { mapAppointmentPeerAvatarsToHttpResponse } from './map-appointment-peer-avatars-http-response';

export function mapGetAppointmentsHttpResponse(
  output: GetAppointmentsOutput,
  payload: IGetAppointmentsQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items.map(mapAppointmentPeerAvatarsToHttpResponse),
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}
