import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';
import { mapAppointmentPeerAvatarsToHttpResponse } from './map-appointment-peer-avatars-http-response';

export type IGetInProgressAppointmentHttpResponse = ReturnType<
  typeof mapGetInProgressAppointmentHttpResponse
>;

export function mapGetInProgressAppointmentHttpResponse(
  output: IAppointmentPublicEntity | null,
) {
  return mapEntityHttpResponse({
    item: output ? mapAppointmentPeerAvatarsToHttpResponse(output) : null,
  });
}
