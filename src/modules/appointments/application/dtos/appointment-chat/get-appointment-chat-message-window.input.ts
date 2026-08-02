import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';

export type IGetAppointmentChatMessageWindowApplicationInput = {
  actor: IAppointmentActorInput;
  chatId: string;
  limit: number;
  beforeCreatedAt?: Date;
  beforeId?: string;
  afterCreatedAt?: Date;
  afterId?: string;
};
