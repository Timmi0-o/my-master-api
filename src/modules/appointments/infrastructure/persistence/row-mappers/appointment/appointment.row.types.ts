import type {
  EAppointmentCancelledBy,
  EAppointmentStatus,
} from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import type { MasterProfileRelationRow } from 'src/modules/masters/infrastructure/persistence/row-mappers/master-service/master-service.row.types';
import type { MasterServiceRelationRow } from 'src/modules/masters/infrastructure/persistence/row-mappers/master-service/master-service.row.types';
import type { UserRow } from 'src/modules/users/infrastructure/persistence/row-mappers/user/user.row.types';

export type AppointmentChatMessageRelationRow = {
  id: string;
  chatId: string;
  senderUserId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type AppointmentChatRelationRow = {
  id: string;
  appointmentId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  messages?: AppointmentChatMessageRelationRow[];
};

export type AppointmentRow = {
  id: string;
  masterProfileId: string;
  masterServiceId: string;
  clientUserId: string;
  startsAt: Date;
  durationMinutes: number;
  status: EAppointmentStatus;
  totalPrice: number;
  serviceName: string;
  cancelledAt: Date | null;
  cancelledBy: EAppointmentCancelledBy | null;
  cancelReason: string | null;
  isEarlyCompletionByMaster: boolean;
  isEarlyCompletionByClient: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  masterProfile?: MasterProfileRelationRow | null;
  masterService?: MasterServiceRelationRow | null;
  clientUser?: UserRow | null;
  chat?: AppointmentChatRelationRow | null;
};
