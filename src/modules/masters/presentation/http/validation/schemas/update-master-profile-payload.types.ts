import type { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile/master-profile-booking.enum';

export interface IUpdateMasterProfilePayload {
  displayName?: string;
  description?: string;
  rating?: number;
  userId?: string;
  timezone?: string;
  bookingStatus?: EMasterBookingStatus;
  pausedUntil?: string | null;
  minNoticeMinutes?: number;
  maxBookingDaysAhead?: number;
  slotStepMinutes?: number;
  bufferBetweenAppointmentsMinutes?: number;
}
