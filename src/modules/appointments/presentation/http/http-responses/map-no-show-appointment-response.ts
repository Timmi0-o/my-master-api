import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';

export type INoShowAppointmentHttpResponse = ReturnType<
  typeof mapNoShowAppointmentHttpResponse
>;

export function mapNoShowAppointmentHttpResponse(
  output: IAppointmentPublicEntity,
) {
  return mapEntityHttpResponse(output);
}
