import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';

export type ICompleteAppointmentHttpResponse = ReturnType<
  typeof mapCompleteAppointmentHttpResponse
>;

export function mapCompleteAppointmentHttpResponse(
  output: IAppointmentPublicEntity,
) {
  return mapEntityHttpResponse(output);
}
