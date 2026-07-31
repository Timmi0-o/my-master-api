import { CancelAppointmentUseCase } from 'src/modules/appointments/application/use-cases/appointment/cancel-appointment.use-case';
import {
  AppointmentNotCancellableError,
  EAppointmentCancelledBy,
  EAppointmentStatus,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { NotificationType } from 'src/modules/notifications/domain/entities/notification';
import { createMockTransactionManager } from '../../../../support/mocks/transaction-manager.mock';

function createActiveAppointment(
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
    status: EAppointmentStatus.CONFIRMED,
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

function createUseCase(deps: {
  appointmentRepository: IAppointmentRepository;
  createNotificationUseCase?: { execute: jest.Mock };
  sendWebPushToUserUseCase?: { execute: jest.Mock };
  realtimeAppointmentPublisher?: { appointmentUpdated: jest.Mock };
  cancelAppointmentRemindersUseCase?: { execute: jest.Mock };
}) {
  return new CancelAppointmentUseCase(
    createMockTransactionManager(),
    deps.appointmentRepository,
    {
      create: jest.fn().mockResolvedValue({ id: 'msg-1' }),
    } as unknown as IAppointmentChatMessageRepository,
    {
      findEntityById: jest.fn().mockResolvedValue({
        id: 'mp-1',
        userId: 'master-1',
      }),
    } as unknown as IMasterProfileRepository,
    (deps.realtimeAppointmentPublisher ?? {
      appointmentUpdated: jest.fn().mockResolvedValue(undefined),
    }) as never,
    (deps.createNotificationUseCase ?? {
      execute: jest.fn().mockResolvedValue({ id: 'notif-1' }),
    }) as never,
    (deps.sendWebPushToUserUseCase ?? {
      execute: jest.fn().mockResolvedValue({
        attempted: 0,
        succeeded: 0,
        failed: 0,
        expired: 0,
      }),
    }) as never,
    (deps.cancelAppointmentRemindersUseCase ?? {
      execute: jest.fn().mockResolvedValue(0),
    }) as never,
  );
}

describe('CancelAppointmentUseCase', () => {
  it('cancels as client and notifies master', async () => {
    const active = createActiveAppointment();
    const cancelled = {
      ...active,
      status: EAppointmentStatus.CANCELLED,
      cancelledAt: new Date('2026-08-01T12:00:00.000Z'),
      cancelledBy: EAppointmentCancelledBy.CLIENT,
      cancelReason: null,
    };

    const appointmentRepository = {
      findEntityById: jest.fn().mockResolvedValue(active),
      update: jest.fn().mockResolvedValue(cancelled),
    } as unknown as IAppointmentRepository;

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

    const cancelAppointmentRemindersUseCase = {
      execute: jest.fn().mockResolvedValue(2),
    };

    const useCase = createUseCase({
      appointmentRepository,
      createNotificationUseCase,
      sendWebPushToUserUseCase,
      cancelAppointmentRemindersUseCase,
    });

    const result = await useCase.execute({
      id: 'appt-1',
      actor: { userId: 'client-1', isStaffUser: false },
    });

    expect(result.status).toBe(EAppointmentStatus.CANCELLED);
    expect(appointmentRepository.update).toHaveBeenCalledWith(
      'appt-1',
      expect.objectContaining({
        status: EAppointmentStatus.CANCELLED,
        cancelledBy: EAppointmentCancelledBy.CLIENT,
        cancelReason: null,
        cancelledAt: expect.any(Date),
      }),
      expect.anything(),
    );
    expect(cancelAppointmentRemindersUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ appointmentId: 'appt-1' }),
    );
    expect(createNotificationUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'master-1',
        type: NotificationType.APPOINTMENT_CANCELLED,
      }),
    );
    expect(sendWebPushToUserUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'master-1' }),
    );
  });

  it('cancels as master with reason and notifies client', async () => {
    const active = createActiveAppointment({
      status: EAppointmentStatus.PENDING,
    });
    const cancelled = {
      ...active,
      status: EAppointmentStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelledBy: EAppointmentCancelledBy.MASTER,
      cancelReason: 'Busy',
    };

    const appointmentRepository = {
      findEntityById: jest.fn().mockResolvedValue(active),
      update: jest.fn().mockResolvedValue(cancelled),
    } as unknown as IAppointmentRepository;

    const createNotificationUseCase = {
      execute: jest.fn().mockResolvedValue({ id: 'notif-1' }),
    };

    const useCase = createUseCase({
      appointmentRepository,
      createNotificationUseCase,
    });

    await useCase.execute({
      id: 'appt-1',
      actor: { userId: 'master-1', isStaffUser: false },
      cancelReason: 'Busy',
    });

    expect(appointmentRepository.update).toHaveBeenCalledWith(
      'appt-1',
      expect.objectContaining({
        cancelledBy: EAppointmentCancelledBy.MASTER,
        cancelReason: 'Busy',
      }),
      expect.anything(),
    );
    expect(createNotificationUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'client-1',
        type: NotificationType.APPOINTMENT_CANCELLED,
      }),
    );
  });

  it('rejects cancel when appointment is COMPLETED', async () => {
    const useCase = createUseCase({
      appointmentRepository: {
        findEntityById: jest.fn().mockResolvedValue(
          createActiveAppointment({ status: EAppointmentStatus.COMPLETED }),
        ),
        update: jest.fn(),
      } as never,
    });

    await expect(
      useCase.execute({
        id: 'appt-1',
        actor: { userId: 'client-1', isStaffUser: false },
      }),
    ).rejects.toBeInstanceOf(AppointmentNotCancellableError);
  });
});
