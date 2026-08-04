import { GetMyClientsInProgressAppointmentUseCase } from 'src/modules/appointments/application/use-cases/appointment/get-my-clients-in-progress-appointment.use-case';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
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

describe('GetMyClientsInProgressAppointmentUseCase', () => {
  it('returns in-progress appointment for master actor', async () => {
    const item = createAppointment();
    const appointmentRepository = {
      findInProgressForMaster: jest.fn().mockResolvedValue(item),
    } as unknown as IAppointmentRepository;

    const useCase = new GetMyClientsInProgressAppointmentUseCase(
      appointmentRepository,
      {} as IUserPersonalNoteRepository,
      {} as IImageRepository,
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
