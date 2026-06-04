import type { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile/master-profile-booking.enum';

export type MasterProfileRelationRow = {
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
};

export type MasterServiceRelationRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  masterProfileId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MasterServiceRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  masterProfileId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  masterProfile?: MasterProfileRelationRow | null;
};
