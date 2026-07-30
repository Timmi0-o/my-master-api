import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';

export type IUpdateAppointmentHttpResponse = ReturnType<typeof mapUpdateAppointmentHttpResponse>;

export function mapUpdateAppointmentHttpResponse(output: IAppointmentPublicEntity) {
  return mapEntityHttpResponse(output);
}
