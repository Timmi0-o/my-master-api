import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetAppointmentChatsOutput } from 'src/modules/appointments/application/dtos/appointment-chat/get-appointment-chats.output';
import { mapAppointmentPeerAvatarsToHttpResponse } from './map-appointment-peer-avatars-http-response';
import type { IGetAppointmentChatsQueryPayload } from '../validation/schemas/get-appointment-chats-query.types';

export function mapGetAppointmentChatsHttpResponse(
  output: GetAppointmentChatsOutput,
  payload: IGetAppointmentChatsQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items.map((chat) => {
      const withAppointment = chat as typeof chat & {
        appointment?: unknown;
      };

      if (withAppointment.appointment == null) {
        return chat;
      }

      return {
        ...withAppointment,
        appointment: mapAppointmentPeerAvatarsToHttpResponse(
          withAppointment.appointment,
        ),
      };
    }),
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}
