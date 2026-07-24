import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';
import { mapAppointmentPeerAvatarsToHttpResponse } from './map-appointment-peer-avatars-http-response';

export type IGetAppointmentByIdHttpResponse = ReturnType<
  typeof mapGetAppointmentByIdHttpResponse
>;

export function mapGetAppointmentByIdHttpResponse(
  output: IAppointmentPublicEntity,
) {
  return mapEntityHttpResponse(mapAppointmentPeerAvatarsToHttpResponse(output));
}
