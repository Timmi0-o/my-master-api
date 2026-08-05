import type { ICreateAppointmentChatMessageAttachmentInput } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export interface ICreateAppointmentChatMessageApplicationInput {
  chatId: string;
  body?: string | null;
  attachments?: readonly ICreateAppointmentChatMessageAttachmentInput[];
  actor: IAppointmentActorInput;
}
