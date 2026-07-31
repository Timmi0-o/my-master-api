import { CreateAppointmentUseCase } from 'src/modules/appointments/application/use-cases/appointment/create-appointment.use-case';
import { AppointmentNotAvailableError } from 'src/modules/appointments/domain/entities/appointment';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import { EAppointmentChatMessageActor } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import { MasterEmailNotVerifiedError } from 'src/modules/masters/domain/entities/master-profile';
import { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile/master-profile-booking.enum';
import { EDayOfWeek } from 'src/modules/masters/domain/entities/master-weekly-schedule/master-weekly-schedule.enum';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import { fromZonedTime } from 'date-fns-tz';
import { createMockTransactionManager } from '../../../../support/mocks/transaction-manager.mock';

/** Monday 2026-08-03 10:00 Europe/Moscow */
const SLOT_STARTS_AT = fromZonedTime(
  new Date(2026, 7, 3, 10, 0, 0, 0),
  'Europe/Moscow',
);

function createMasterProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: 'mp-1',
    userId: 'master-1',
    displayName: 'Master',
    description: '',
    rating: 0,
    timezone: 'Europe/Moscow',
    bookingStatus: EMasterBookingStatus.ACCEPTING,
    pausedUntil: null,
    minNoticeMinutes: 0,
    maxBookingDaysAhead: 365,
    slotStepMinutes: 30,
    bufferBetweenAppointmentsMinutes: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function createWeeklyScheduleRepo(
  schedules: Array<{
    dayOfWeek: EDayOfWeek;
    startTime: string;
    endTime: string;
  }> = [
    {
      dayOfWeek: EDayOfWeek.MONDAY,
      startTime: '09:00',
      endTime: '18:00',
    },
  ],
) {
  return {
    findMany: jest.fn().mockResolvedValue(
      schedules.map((schedule, index) => ({
        id: `ws-${index}`,
        masterProfileId: 'mp-1',
        ...schedule,
      })),
    ),
  } as unknown as IMasterWeeklyScheduleRepository;
}

function createEmptyExceptionRepo() {
  return {
    findMany: jest.fn().mockResolvedValue([]),
  } as unknown as IMasterScheduleExceptionRepository;
}

function createUseCase(deps: {
  appointmentRepository: IAppointmentRepository;
  appointmentChatRepository?: IAppointmentChatRepository;
  appointmentChatMessageRepository?: IAppointmentChatMessageRepository;
  masterProfileRepository?: IMasterProfileRepository;
  masterServiceRepository?: IMasterServiceRepository;
  masterWeeklyScheduleRepository?: IMasterWeeklyScheduleRepository;
  masterScheduleExceptionRepository?: IMasterScheduleExceptionRepository;
  ownerEmailVerifiedAt?: Date | null;
}) {
  return new CreateAppointmentUseCase(
    createMockTransactionManager(),
    deps.appointmentRepository,
    deps.appointmentChatRepository ??
      ({
        findEntityByMasterProfileAndClient: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          id: 'chat-1',
          masterProfileId: 'mp-1',
          clientUserId: 'client-1',
        }),
      } as unknown as IAppointmentChatRepository),
    deps.appointmentChatMessageRepository ??
      ({
        create: jest.fn().mockResolvedValue({ id: 'msg-1' }),
      } as unknown as IAppointmentChatMessageRepository),
    deps.masterProfileRepository ??
      ({
        findEntityById: jest.fn().mockResolvedValue(createMasterProfile()),
      } as unknown as IMasterProfileRepository),
    deps.masterServiceRepository ??
      ({
        findEntityById: jest.fn().mockResolvedValue({
          id: 'svc-1',
          masterProfileId: 'mp-1',
          durationMinutes: 60,
          price: 100,
          name: 'Haircut',
        }),
      } as unknown as IMasterServiceRepository),
    deps.masterWeeklyScheduleRepository ?? createWeeklyScheduleRepo(),
    deps.masterScheduleExceptionRepository ?? createEmptyExceptionRepo(),
    { existsActiveBetweenUsers: jest.fn().mockResolvedValue(false) } as never,
    {
      findEntityById: jest.fn().mockResolvedValue({
        id: 'master-1',
        emailVerifiedAt:
          deps.ownerEmailVerifiedAt === undefined
            ? new Date('2026-01-01T00:00:00.000Z')
            : deps.ownerEmailVerifiedAt,
      }),
    } as never,
    { appointmentCreated: jest.fn().mockResolvedValue(undefined) } as never,
    { execute: jest.fn().mockResolvedValue({ id: 'notif-1' }) } as never,
    {
      execute: jest.fn().mockResolvedValue({
        attempted: 0,
        succeeded: 0,
        failed: 0,
        expired: 0,
      }),
    } as never,
  );
}

describe('CreateAppointmentUseCase', () => {
  it('orchestrates appointment, chat and messages in one transaction', async () => {
    const appointment = { id: 'appt-1' };
    const chat = {
      id: 'chat-1',
      masterProfileId: 'mp-1',
      clientUserId: 'client-1',
    };

    const appointmentRepository = {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue(appointment),
    } as unknown as IAppointmentRepository;

    const appointmentChatRepository = {
      findEntityByMasterProfileAndClient: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(chat),
    } as unknown as IAppointmentChatRepository;

    const appointmentChatMessageRepository = {
      create: jest.fn().mockResolvedValue({ id: 'msg-1' }),
    } as unknown as IAppointmentChatMessageRepository;

    const useCase = createUseCase({
      appointmentRepository,
      appointmentChatRepository,
      appointmentChatMessageRepository,
    });

    const result = await useCase.execute({
      actor: { userId: 'client-1', isStaffUser: false },
      masterProfileId: 'mp-1',
      masterServiceId: 'svc-1',
      startsAt: SLOT_STARTS_AT,
      initialMessage: { body: 'Hello' },
    });

    expect(result).toEqual(appointment);
    expect(
      appointmentChatRepository.findEntityByMasterProfileAndClient,
    ).toHaveBeenCalledWith('mp-1', 'client-1', expect.anything());
    expect(appointmentChatRepository.create).toHaveBeenCalledWith(
      { masterProfileId: 'mp-1', clientUserId: 'client-1' },
      expect.anything(),
    );
    expect(appointmentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        masterProfileId: 'mp-1',
        masterServiceId: 'svc-1',
        clientUserId: 'client-1',
        chatId: 'chat-1',
        status: EAppointmentStatus.PENDING,
      }),
      expect.anything(),
    );
    expect(appointmentChatMessageRepository.create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        chatId: 'chat-1',
        senderUserId: null,
        actor: EAppointmentChatMessageActor.SYSTEM,
        body: 'Услуга Haircut создана',
      }),
      expect.anything(),
    );
    expect(appointmentChatMessageRepository.create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        chatId: 'chat-1',
        senderUserId: 'client-1',
        actor: EAppointmentChatMessageActor.USER,
        body: 'Hello',
      }),
      expect.anything(),
    );
  });

  it('reuses existing chat for the same master and client', async () => {
    const appointment = { id: 'appt-2' };
    const existingChat = {
      id: 'chat-existing',
      masterProfileId: 'mp-1',
      clientUserId: 'client-1',
    };

    const appointmentRepository = {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue(appointment),
    } as unknown as IAppointmentRepository;

    const appointmentChatRepository = {
      findEntityByMasterProfileAndClient: jest
        .fn()
        .mockResolvedValue(existingChat),
      create: jest.fn(),
    } as unknown as IAppointmentChatRepository;

    const useCase = createUseCase({
      appointmentRepository,
      appointmentChatRepository,
    });

    await useCase.execute({
      actor: { userId: 'client-1', isStaffUser: false },
      masterProfileId: 'mp-1',
      masterServiceId: 'svc-1',
      startsAt: SLOT_STARTS_AT,
    });

    expect(appointmentChatRepository.create).not.toHaveBeenCalled();
    expect(appointmentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ chatId: 'chat-existing' }),
      expect.anything(),
    );
  });

  it('throws when selected slot overlaps an existing appointment including buffer', async () => {
    const overlappingStartsAt = fromZonedTime(
      new Date(2026, 7, 3, 9, 30, 0, 0),
      'Europe/Moscow',
    );

    const appointmentRepository = {
      findMany: jest.fn().mockImplementation((params: {
        where?: { and?: Array<Record<string, unknown>> };
      }) => {
        const and = params?.where?.and ?? [];
        const isClientQuery = and.some((clause) => 'clientUserId' in clause);
        if (isClientQuery) {
          return Promise.resolve([]);
        }
        return Promise.resolve([
          {
            id: 'appt-existing',
            masterProfileId: 'mp-1',
            masterServiceId: 'svc-other',
            startsAt: overlappingStartsAt,
            durationMinutes: 60,
            status: EAppointmentStatus.CONFIRMED,
          },
        ]);
      }),
      create: jest.fn(),
    } as unknown as IAppointmentRepository;

    const useCase = createUseCase({ appointmentRepository });

    await expect(
      useCase.execute({
        actor: { userId: 'client-1', isStaffUser: false },
        masterProfileId: 'mp-1',
        masterServiceId: 'svc-1',
        startsAt: SLOT_STARTS_AT,
      }),
    ).rejects.toBeInstanceOf(AppointmentNotAvailableError);
    expect(appointmentRepository.create).not.toHaveBeenCalled();
  });

  it('throws when selected slot overlaps the client own appointment at another master', async () => {
    const clientBusyStartsAt = fromZonedTime(
      new Date(2026, 7, 3, 9, 30, 0, 0),
      'Europe/Moscow',
    );

    const appointmentRepository = {
      findMany: jest.fn().mockImplementation((params: {
        where?: { and?: Array<Record<string, unknown>> };
      }) => {
        const and = params?.where?.and ?? [];
        const isClientQuery = and.some((clause) => 'clientUserId' in clause);
        if (isClientQuery) {
          return Promise.resolve([
            {
              id: 'appt-client',
              masterProfileId: 'mp-other',
              masterServiceId: 'svc-other',
              clientUserId: 'client-1',
              startsAt: clientBusyStartsAt,
              durationMinutes: 60,
              status: EAppointmentStatus.PENDING,
            },
          ]);
        }
        return Promise.resolve([]);
      }),
      create: jest.fn(),
    } as unknown as IAppointmentRepository;

    const useCase = createUseCase({ appointmentRepository });

    await expect(
      useCase.execute({
        actor: { userId: 'client-1', isStaffUser: false },
        masterProfileId: 'mp-1',
        masterServiceId: 'svc-1',
        startsAt: SLOT_STARTS_AT,
      }),
    ).rejects.toBeInstanceOf(AppointmentNotAvailableError);
    expect(appointmentRepository.create).not.toHaveBeenCalled();
  });

  it('throws when startsAt is outside weekly schedule', async () => {
    const appointmentRepository = {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
    } as unknown as IAppointmentRepository;

    const useCase = createUseCase({
      appointmentRepository,
      masterWeeklyScheduleRepository: createWeeklyScheduleRepo([]),
    });

    await expect(
      useCase.execute({
        actor: { userId: 'client-1', isStaffUser: false },
        masterProfileId: 'mp-1',
        masterServiceId: 'svc-1',
        startsAt: SLOT_STARTS_AT,
      }),
    ).rejects.toBeInstanceOf(AppointmentNotAvailableError);
  });

  it('throws when master owner email is not verified', async () => {
    const appointmentRepository = {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
    } as unknown as IAppointmentRepository;

    const useCase = createUseCase({
      appointmentRepository,
      ownerEmailVerifiedAt: null,
    });

    await expect(
      useCase.execute({
        actor: { userId: 'client-1', isStaffUser: false },
        masterProfileId: 'mp-1',
        masterServiceId: 'svc-1',
        startsAt: SLOT_STARTS_AT,
      }),
    ).rejects.toBeInstanceOf(MasterEmailNotVerifiedError);
    expect(appointmentRepository.create).not.toHaveBeenCalled();
  });
});
