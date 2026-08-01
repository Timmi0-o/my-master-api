import { ConfirmAppointmentUseCase } from 'src/modules/appointments/application/use-cases/appointment/confirm-appointment.use-case';
import {
  AppointmentForbiddenError,
  AppointmentNotConfirmableError,
  EAppointmentStatus,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { NotificationType } from 'src/modules/notifications/domain/entities/notification';
import { createMockTransactionManager } from '../../../../support/mocks/transaction-manager.mock';

function createPendingAppointment(
  overrides: Record<string, unknown> = {},
) {
  return {
    id: 'appt-1',
    masterProfileId: 'mp-1',
    masterServiceId: 'svc-1',
    clientUserId: 'client-1',
    chatId: 'chat-1',
    startsAt: new Date('2026-08-03T10:00:00.000Z'),
    durationMinutes: 60,
    status: EAppointmentStatus.PENDING,
    totalPrice: 100,
    serviceName: 'Haircut',
    cancelledAt: null,
    cancelledBy: null,
    cancelReason: null,
    isEarlyCompletionByMaster: false,
    isEarlyCompletionByClient: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('ConfirmAppointmentUseCase', () => {
  it('confirms pending appointment as master and notifies client', async () => {
    const pending = createPendingAppointment();
    const confirmed = {
      ...pending,
      status: EAppointmentStatus.CONFIRMED,
    };

    const appointmentRepository = {
      findEntityById: jest.fn().mockResolvedValue(pending),
      update: jest.fn().mockResolvedValue(confirmed),
    } as unknown as IAppointmentRepository;

    const appointmentChatMessageRepository = {
      create: jest.fn().mockResolvedValue({ id: 'msg-1' }),
    } as unknown as IAppointmentChatMessageRepository;

    const masterProfileRepository = {
      findEntityById: jest.fn().mockResolvedValue({
        id: 'mp-1',
        userId: 'master-1',
      }),
    } as unknown as IMasterProfileRepository;

    const realtimeAppointmentPublisher = {
      appointmentUpdated: jest.fn().mockResolvedValue(undefined),
    };

    const createNotificationUseCase = {
      execute: jest.fn().mockResolvedValue({ id: 'notif-1' }),
    };

    const sendWebPushToUserUseCase = {
      execute: jest.fn().mockResolvedValue({
        attempted: 0,
        succeeded: 0,
        failed: 0,
        expired: 0,
      }),
    };

    const scheduleAppointmentRemindersUseCase = {
      execute: jest.fn().mockResolvedValue([]),
    };

    const useCase = new ConfirmAppointmentUseCase(
      createMockTransactionManager(),
      appointmentRepository,
      appointmentChatMessageRepository,
      masterProfileRepository,
      {
        findEntityById: jest.fn().mockResolvedValue({ language: 'RU' }),
      } as never,
      realtimeAppointmentPublisher as never,
      { messageCreated: jest.fn().mockResolvedValue(undefined) } as never,
      createNotificationUseCase as never,
      sendWebPushToUserUseCase as never,
      {
        resolve: jest.fn().mockReturnValue({
          title: 'Запись подтверждена',
          body: 'Мастер подтвердил запись «Haircut»',
        }),
      } as never,
      scheduleAppointmentRemindersUseCase as never,
    );

    const result = await useCase.execute({
      id: 'appt-1',
      actor: { userId: 'master-1', isStaffUser: false },
    });

    expect(result.status).toBe(EAppointmentStatus.CONFIRMED);
    expect(appointmentRepository.update).toHaveBeenCalledWith(
      'appt-1',
      { status: EAppointmentStatus.CONFIRMED },
      expect.anything(),
    );
    expect(appointmentChatMessageRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        chatId: 'chat-1',
        body: null,
        systemAction: 'APPOINTMENT_CONFIRMED',
        payload: { serviceName: 'Haircut' },
      }),
      expect.anything(),
    );
    expect(scheduleAppointmentRemindersUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        appointmentId: 'appt-1',
        startsAt: pending.startsAt,
      }),
    );
    expect(createNotificationUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'client-1',
        type: NotificationType.APPOINTMENT_CONFIRMED,
        idempotencyKey: 'appointment_confirmed:appt-1',
      }),
    );
    expect(sendWebPushToUserUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'client-1' }),
    );
    expect(realtimeAppointmentPublisher.appointmentUpdated).toHaveBeenCalledTimes(
      2,
    );
  });

  it('rejects confirm by client', async () => {
    const useCase = new ConfirmAppointmentUseCase(
      createMockTransactionManager(),
      {
        findEntityById: jest.fn().mockResolvedValue(createPendingAppointment()),
        update: jest.fn(),
      } as never,
      { create: jest.fn() } as never,
      {
        findEntityById: jest.fn().mockResolvedValue({
          id: 'mp-1',
          userId: 'master-1',
        }),
      } as never,
      { findEntityById: jest.fn() } as never,
      { appointmentUpdated: jest.fn() } as never,
      { messageCreated: jest.fn() } as never,
      { execute: jest.fn() } as never,
      { execute: jest.fn() } as never,
      { resolve: jest.fn() } as never,
      { execute: jest.fn() } as never,
    );

    await expect(
      useCase.execute({
        id: 'appt-1',
        actor: { userId: 'client-1', isStaffUser: false },
      }),
    ).rejects.toBeInstanceOf(AppointmentForbiddenError);
  });

  it('rejects confirm when status is not PENDING', async () => {
    const useCase = new ConfirmAppointmentUseCase(
      createMockTransactionManager(),
      {
        findEntityById: jest.fn().mockResolvedValue(
          createPendingAppointment({ status: EAppointmentStatus.CONFIRMED }),
        ),
        update: jest.fn(),
      } as never,
      { create: jest.fn() } as never,
      {
        findEntityById: jest.fn().mockResolvedValue({
          id: 'mp-1',
          userId: 'master-1',
        }),
      } as never,
      { findEntityById: jest.fn() } as never,
      { appointmentUpdated: jest.fn() } as never,
      { messageCreated: jest.fn() } as never,
      { execute: jest.fn() } as never,
      { execute: jest.fn() } as never,
      { resolve: jest.fn() } as never,
      { execute: jest.fn() } as never,
    );

    await expect(
      useCase.execute({
        id: 'appt-1',
        actor: { userId: 'master-1', isStaffUser: false },
      }),
    ).rejects.toBeInstanceOf(AppointmentNotConfirmableError);
  });
});
