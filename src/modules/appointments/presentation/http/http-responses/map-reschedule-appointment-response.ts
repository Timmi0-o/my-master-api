import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';

export type IRescheduleAppointmentHttpResponse = ReturnType<
  typeof mapRescheduleAppointmentHttpResponse
>;

export function mapRescheduleAppointmentHttpResponse(
  output: IAppointmentPublicEntity,
) {
  return mapEntityHttpResponse(output);
}
