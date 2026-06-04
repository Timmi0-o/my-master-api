import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetAppointmentChatMessagesOutput } from 'src/modules/appointments/application/dtos/appointment-chat-message/get-appointment-chat-messages.output';
import type { IGetAppointmentChatMessagesQueryPayload } from '../validation/schemas/get-appointment-chat-messages-query.types';

export function mapGetAppointmentChatMessagesHttpResponse(
  output: GetAppointmentChatMessagesOutput,
  payload: IGetAppointmentChatMessagesQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}
