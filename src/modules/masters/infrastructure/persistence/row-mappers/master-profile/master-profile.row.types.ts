import type { MasterServiceRelationRow } from '../master-service/master-service.row.types';

import type { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile/master-profile-booking.enum';

export type MasterProfileRow = {
  id: string;
  userId: string;
  displayName: string;
  description: string;
  rating: number;
  timezone: string;
  bookingStatus: EMasterBookingStatus;
  pausedUntil: Date | null;
  minNoticeMinutes: number;
  maxBookingDaysAhead: number;
  slotStepMinutes: number;
  bufferBetweenAppointmentsMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  services?: MasterServiceRelationRow[];
};
