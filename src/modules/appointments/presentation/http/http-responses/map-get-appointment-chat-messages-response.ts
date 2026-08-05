import type { GetAppointmentChatMessagesOutput } from 'src/modules/appointments/application/dtos/appointment-chat-message/get-appointment-chat-messages.output';
import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/http-responses/build-paginated-list-response';
import type { IGetAppointmentChatMessagesQueryPayload } from '../validation/schemas/get-appointment-chat-messages-query.types';
import { mapAppointmentChatMessageWithAttachmentsToHttp } from './map-appointment-chat-message-with-attachments';

export function mapGetAppointmentChatMessagesHttpResponse(
  output: GetAppointmentChatMessagesOutput,
  payload: IGetAppointmentChatMessagesQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items.map(mapAppointmentChatMessageWithAttachmentsToHttp),
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}
