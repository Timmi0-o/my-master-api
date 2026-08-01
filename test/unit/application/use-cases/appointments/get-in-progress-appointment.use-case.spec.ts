import { isAppointmentInProgress } from 'src/modules/appointments/domain/entities/appointment/policies/is-appointment-in-progress';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment';
import { GetMyInProgressAppointmentUseCase } from 'src/modules/appointments/application/use-cases/appointment/get-my-in-progress-appointment.use-case';
import { GetMyClientsInProgressAppointmentUseCase } from 'src/modules/appointments/application/use-cases/appointment/get-my-clients-in-progress-appointment.use-case';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';

function createAppointment(overrides: Record<string, unknown> = {}) {
  return {
    id: 'appt-1',
    masterProfileId: 'mp-1',
    masterServiceId: 'svc-1',
    clientUserId: 'client-1',
    chatId: 'chat-1',
    startsAt: new Date('2026-08-01T10:00:00.000Z'),
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
    deletedAt: null,
    ...overrides,
  };
}

describe('isAppointmentInProgress', () => {
  const now = new Date('2026-08-01T10:30:00.000Z');

  it('returns true for CONFIRMED inside the slot window', () => {
    expect(isAppointmentInProgress(createAppointment(), now)).toBe(true);
  });

  it('returns true for PENDING inside the slot window', () => {
    expect(
      isAppointmentInProgress(
        createAppointment({ status: EAppointmentStatus.PENDING }),
        now,
      ),
    ).toBe(true);
  });

  it('returns false before startsAt', () => {
    expect(
      isAppointmentInProgress(
        createAppointment(),
        new Date('2026-08-01T09:59:59.000Z'),
      ),
    ).toBe(false);
  });

  it('returns false at or after endsAt', () => {
    expect(
      isAppointmentInProgress(
        createAppointment(),
        new Date('2026-08-01T11:00:00.000Z'),
      ),
    ).toBe(false);
  });

  it('returns false for COMPLETED and CANCELLED', () => {
    expect(
      isAppointmentInProgress(
        createAppointment({ status: EAppointmentStatus.COMPLETED }),
        now,
      ),
    ).toBe(false);
    expect(
      isAppointmentInProgress(
        createAppointment({ status: EAppointmentStatus.CANCELLED }),
        now,
      ),
    ).toBe(false);
  });

  it('returns false for soft-deleted appointments', () => {
    expect(
      isAppointmentInProgress(
        createAppointment({ deletedAt: new Date() }),
        now,
      ),
    ).toBe(false);
  });
});

describe('GetMyInProgressAppointmentUseCase', () => {
  it('returns in-progress appointment for client actor', async () => {
    const item = createAppointment();
    const appointmentRepository = {
      findInProgressForClient: jest.fn().mockResolvedValue(item),
    } as unknown as IAppointmentRepository;
    const personalNoteRepository = {
      findActiveByOwnerAndReferenceUserIds: jest.fn(),
    } as unknown as IUserPersonalNoteRepository;

    const useCase = new GetMyInProgressAppointmentUseCase(
      appointmentRepository,
      personalNoteRepository,
    );

    const result = await useCase.execute({
      actor: { userId: 'client-1', isStaffUser: false },
      params: {},
    });

    expect(result).toEqual(item);
    expect(appointmentRepository.findInProgressForClient).toHaveBeenCalledWith(
      'client-1',
      expect.any(Date),
      {},
    );
  });

  it('returns null when no in-progress appointment', async () => {
    const appointmentRepository = {
      findInProgressForClient: jest.fn().mockResolvedValue(null),
    } as unknown as IAppointmentRepository;

    const useCase = new GetMyInProgressAppointmentUseCase(
      appointmentRepository,
      {} as IUserPersonalNoteRepository,
    );

    await expect(
      useCase.execute({
        actor: { userId: 'client-1', isStaffUser: false },
        params: {},
      }),
    ).resolves.toBeNull();
  });
});

describe('GetMyClientsInProgressAppointmentUseCase', () => {
  it('returns in-progress appointment for master actor', async () => {
    const item = createAppointment();
    const appointmentRepository = {
      findInProgressForMaster: jest.fn().mockResolvedValue(item),
    } as unknown as IAppointmentRepository;

    const useCase = new GetMyClientsInProgressAppointmentUseCase(
      appointmentRepository,
      {} as IUserPersonalNoteRepository,
    );

    const result = await useCase.execute({
      actor: { userId: 'master-1', isStaffUser: false },
      params: {},
    });

    expect(result).toEqual(item);
    expect(appointmentRepository.findInProgressForMaster).toHaveBeenCalledWith(
      'master-1',
      expect.any(Date),
      {},
    );
  });
});
