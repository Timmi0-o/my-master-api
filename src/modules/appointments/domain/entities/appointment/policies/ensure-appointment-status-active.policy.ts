import { EAppointmentStatus } from '../appointment.enum';
import { AppointmentForbiddenError } from '../errors';
import type { IAppointmentEntity } from '../i-appointment.entity';

/**
 * Проверка, что запись активна для написания сообщений в чат
 */
export function ensureAppointmentStatusActive(
  entity: IAppointmentEntity,
): asserts entity is IAppointmentEntity {
  if (
    entity.status !== EAppointmentStatus.PENDING &&
    entity.status !== EAppointmentStatus.NO_SHOW
  ) {
    throw new AppointmentForbiddenError(
      entity.id,
      'Запрещено писать сообщения в чат если запись уже завершена',
    );
  }
}
