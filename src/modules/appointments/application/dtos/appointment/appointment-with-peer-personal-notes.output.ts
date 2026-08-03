import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IUserPersonalNotePublicEntity } from 'src/modules/users/domain/entities/user-personal-note';

type PeerPersonalNote = {
  personalNote?: IUserPersonalNotePublicEntity | null;
};

export type IAppointmentWithPeerPersonalNotes = IAppointmentPublicEntity &
  Partial<
    Omit<IAppointmentRelations, 'masterProfile' | 'clientUser'> & {
      masterProfile?:
        | (IAppointmentRelations['masterProfile'] & PeerPersonalNote)
        | null;
      clientUser?:
        | (IAppointmentRelations['clientUser'] & PeerPersonalNote)
        | null;
    }
  >;
