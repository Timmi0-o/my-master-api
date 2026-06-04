import type { ICreateAppointmentApplicationInput } from 'src/modules/appointments/application/dtos/appointment/create-appointment.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateAppointmentPayload } from '../../validation/schemas/create-appointment-payload.types';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function payloadToCreateAppointmentInput(
  payload: ICreateAppointmentPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateAppointmentApplicationInput {
  return {
    masterProfileId: payload.masterProfileId,
    masterServiceId: payload.masterServiceId,
    clientUserId: payload.clientUserId,
    startsAt: new Date(payload.startsAt),
    status: payload.status,
    initialMessage: payload.initialMessage,
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
