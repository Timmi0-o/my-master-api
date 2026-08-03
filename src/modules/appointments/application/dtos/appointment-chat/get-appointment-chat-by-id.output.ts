import type { IAppointmentChatPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentWithPeerPersonalNotes } from '../appointment/appointment-with-peer-personal-notes.output';

export type IGetAppointmentChatByIdApplicationOutput =
  IAppointmentChatPublicEntity & {
    appointment?: IAppointmentWithPeerPersonalNotes | null;
  };
