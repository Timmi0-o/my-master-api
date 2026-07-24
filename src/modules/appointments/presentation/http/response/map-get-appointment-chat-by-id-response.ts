import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import { mapAppointmentPeerAvatarsToHttpResponse } from './map-appointment-peer-avatars-http-response';

export type IGetAppointmentChatByIdHttpResponse = ReturnType<
  typeof mapGetAppointmentChatByIdHttpResponse
>;

export function mapGetAppointmentChatByIdHttpResponse<T extends object>(
  output: T,
) {
  const withAppointment = output as T & { appointment?: unknown };

  if (withAppointment.appointment == null) {
    return mapEntityHttpResponse(output);
  }

  return mapEntityHttpResponse({
    ...withAppointment,
    appointment: mapAppointmentPeerAvatarsToHttpResponse(
      withAppointment.appointment,
    ),
  });
}
