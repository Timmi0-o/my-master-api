import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetAppointmentChatsOutput } from 'src/modules/appointments/application/dtos/appointment-chat/get-appointment-chats.output';
import type { IGetAppointmentChatsQueryPayload } from '../validation/schemas/get-appointment-chats-query.types';

export function mapGetAppointmentChatsHttpResponse(
  output: GetAppointmentChatsOutput,
  payload: IGetAppointmentChatsQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}
