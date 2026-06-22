import type { EMasterBookingStatus } from './master-profile-booking.enum';

export interface IMasterProfileEntity {
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
  deletedAt?: Date | null;
}

export type IMasterProfilePublicEntity = IMasterProfileEntity;
