import { attachAppointmentChatsInboxFields } from 'src/modules/appointments/application/helpers/appointment-chat-unread.helper';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import { mergeWhereFilters } from 'src/modules/shared/application/presets/common/query-filter.helper';
import { attachPersonalNotesToAppointmentPeers } from 'src/modules/users/application/helpers/attach-personal-notes.helper';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { GetAppointmentsOutput } from '../../dtos/appointment/get-appointments.output';
import type { IGetMyClientsAppointmentsApplicationInput } from '../../dtos/appointment/get-my-clients-appointments.input';

export class GetMyClientsAppointmentsUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
  ) {}

  async execute(
    input: IGetMyClientsAppointmentsApplicationInput,
  ): Promise<GetAppointmentsOutput> {
    const params = {
      ...input.params,
      where: mergeWhereFilters(input.params.where, {
        masterProfile: { userId: { eq: input.actor.userId } },
      }),
    };
    const [items, total] = await Promise.all([
      this.appointmentRepository.findMany(params),
      this.appointmentRepository.count({ where: params.where }),
    ]);

    const withNotes = params.enrich?.personalNotes
      ? await attachPersonalNotesToAppointmentPeers(
          this.userPersonalNoteRepository,
          input.actor.userId,
          items,
        )
      : items;

    const withInbox = await attachAppointmentChatsInboxFields(
      this.appointmentChatMessageRepository,
      input.actor.userId,
      withNotes,
      { includeLastMessage: true },
    );

    return { items: withInbox, total };
  }
}
