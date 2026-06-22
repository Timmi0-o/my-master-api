import { CreateAppointmentUseCase } from 'src/modules/appointments/application/use-cases/appointment/create-appointment.use-case';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import { createMockTransactionManager } from '../../../../support/mocks/transaction-manager.mock';

describe('CreateAppointmentUseCase', () => {
  it('orchestrates appointment, chat and message in one transaction', async () => {
    const appointment = { id: 'appt-1' };
    const chat = { id: 'chat-1', appointmentId: 'appt-1' };

    const appointmentRepository = {
      create: jest.fn().mockResolvedValue(appointment),
    } as unknown as IAppointmentRepository;

    const appointmentChatRepository = {
      create: jest.fn().mockResolvedValue(chat),
    } as unknown as IAppointmentChatRepository;

    const appointmentChatMessageRepository = {
      create: jest.fn().mockResolvedValue({ id: 'msg-1' }),
    } as unknown as IAppointmentChatMessageRepository;

    const masterProfileRepository = {
      findEntityById: jest.fn().mockResolvedValue({
        id: 'mp-1',
        userId: 'master-1',
      }),
    } as unknown as IMasterProfileRepository;

    const masterServiceRepository = {
      findEntityById: jest.fn().mockResolvedValue({
        id: 'svc-1',
        masterProfileId: 'mp-1',
        durationMinutes: 60,
        price: 100,
        name: 'Haircut',
      }),
    } as unknown as IMasterServiceRepository;

    const useCase = new CreateAppointmentUseCase(
      createMockTransactionManager(),
      appointmentRepository,
      appointmentChatRepository,
      appointmentChatMessageRepository,
      masterProfileRepository,
      masterServiceRepository,
    );

    const startsAt = new Date('2026-07-01T10:00:00.000Z');

    const result = await useCase.execute({
      actor: { userId: 'client-1', isStaffUser: false },
      masterProfileId: 'mp-1',
      masterServiceId: 'svc-1',
      startsAt,
      initialMessage: { body: 'Hello' },
    });

    expect(result).toEqual(appointment);
    expect(appointmentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        masterProfileId: 'mp-1',
        masterServiceId: 'svc-1',
        clientUserId: 'client-1',
        status: EAppointmentStatus.PENDING,
      }),
      expect.anything(),
    );
    expect(appointmentChatRepository.create).toHaveBeenCalledWith(
      { appointmentId: 'appt-1' },
      expect.anything(),
    );
    expect(appointmentChatMessageRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        chatId: 'chat-1',
        senderUserId: 'client-1',
        body: 'Hello',
      }),
      expect.anything(),
    );
  });
});
