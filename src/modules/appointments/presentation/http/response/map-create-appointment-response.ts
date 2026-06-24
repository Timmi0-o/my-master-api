import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';

export type ICreateAppointmentHttpResponse = ReturnType<typeof mapCreateAppointmentHttpResponse>;

export function mapCreateAppointmentHttpResponse(output: IAppointmentPublicEntity) {
  return mapEntityHttpResponse(output);
}
