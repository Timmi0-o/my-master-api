import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IAppointmentChatFiltersPreset } from '../types/appointment-chat-filters-preset.types';

export const APPOINTMENT_CHAT_LIST_ORDER_FIELDS = [
  'id',
  'appointmentId',
  'createdAt',
  'updatedAt',
] as const;

export type TAppointmentChatListOrderField =
  (typeof APPOINTMENT_CHAT_LIST_ORDER_FIELDS)[number];

export interface IGetAppointmentChatsQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TAppointmentChatListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IAppointmentChatFiltersPreset;
  requiredIds?: string[];
}
