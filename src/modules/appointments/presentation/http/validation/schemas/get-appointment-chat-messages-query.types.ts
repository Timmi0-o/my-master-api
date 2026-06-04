import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IAppointmentChatMessageFiltersPreset } from '../types/appointment-chat-message-filters-preset.types';

export const APPOINTMENT_CHAT_MESSAGE_LIST_ORDER_FIELDS = [
  'id',
  'chatId',
  'createdAt',
  'updatedAt',
] as const;

export type TAppointmentChatMessageListOrderField =
  (typeof APPOINTMENT_CHAT_MESSAGE_LIST_ORDER_FIELDS)[number];

export interface IGetAppointmentChatMessagesQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TAppointmentChatMessageListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IAppointmentChatMessageFiltersPreset;
  requiredIds?: string[];
}
