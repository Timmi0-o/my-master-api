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
  images?: MasterServiceImageRelationRow[] | null;
};

export type MasterServiceImageFileRelationRow = {
  id: string;
  fileUrl: string;
  originalName: string;
  mimeType: string;
  fileType: string;
  purpose: string;
  status: string;
  fileSize: bigint;
  createdAt: Date;
  updatedAt: Date;
};

export type MasterServiceImageRelationRow = {
  id: string;
  masterServiceId: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
  file?: MasterServiceImageFileRelationRow | null;
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
  images?: MasterServiceImageRelationRow[] | null;
};
