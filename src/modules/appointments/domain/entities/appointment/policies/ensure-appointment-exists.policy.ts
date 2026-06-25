import type { IAppointmentEntity } from '../i-appointment.entity';
import { AppointmentNotFoundError } from '../errors';

/**
 * Проверка, что запись существует
 */
export function ensureAppointmentExists(
  entity: IAppointmentEntity | null | undefined,
  id: string,
): asserts entity is IAppointmentEntity {
  if (!entity) {
    throw new AppointmentNotFoundError(id);
  }
}
