import type {
  AppointmentCancelledBy,
  AppointmentStatus,
  PrismaClient,
} from '@prisma/client';
import { addDays, setHours, setMinutes, startOfDay } from 'date-fns';
import type { SeedRunner } from './index';

const APPOINTMENTS_TARGET = 24;

type AppointmentSeedSpec = {
  masterProfileIndex: number;
  serviceIndex: number;
  clientUserIndex: number;
  status: AppointmentStatus;
  daysFromNow: number;
  hour: number;
  minute: number;
  clientMessage?: string;
  masterReply?: string;
  followUpMessage?: string;
  cancelledBy?: AppointmentCancelledBy;
  cancelReason?: string;
};

const CLIENT_MESSAGES = [
  'Первый раз записываюсь — подскажите, за сколько минут лучше приехать?',
  'Можно ли перенести на вечер, если появится окно?',
  'Есть аллергия на некоторые средства — учтите, пожалуйста.',
  'Нужна парковка рядом — подскажите, куда лучше встать.',
  'Хотелось бы тихое время, без суеты.',
  'Запишите, пожалуйста, на ближайшее удобное окно.',
  'Могу опоздать на 10–15 минут — предупреждаю заранее.',
  'После прошлого визита всё понравилось, повторяю услугу.',
] as const;

const MASTER_REPLIES = [
  'Принято, ждём вас в назначенное время.',
  'Ок, учту пожелания. Если что — напишите в чат.',
  'Запись подтверждена. До встречи!',
  'Можем сдвинуть на 30 минут позже — напишите, если удобно.',
  'Спасибо за предупреждение, перенесём при необходимости.',
] as const;

const CANCEL_REASONS = [
  'Не получается приехать в это время',
  'Перенёс визит на другой день',
  'Изменились планы',
  'Записался к другому мастеру',
] as const;

const buildSpecs = (): AppointmentSeedSpec[] => {
  const statuses: AppointmentStatus[] = [
    'PENDING',
    'CONFIRMED',
    'CONFIRMED',
    'COMPLETED',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
  ];

  const specs: AppointmentSeedSpec[] = [];

  for (let i = 0; i < APPOINTMENTS_TARGET; i += 1) {
    const status = statuses[i % statuses.length];
    const daysFromNow =
      status === 'COMPLETED' || status === 'NO_SHOW'
        ? -(2 + (i % 12))
        : status === 'CANCELLED'
          ? -(1 + (i % 5))
          : 1 + (i % 21);

    const hour = 9 + (i % 9);
    const minute = i % 2 === 0 ? 0 : 30;

    const spec: AppointmentSeedSpec = {
      masterProfileIndex: i % 12,
      serviceIndex: i % 2,
      clientUserIndex: 5 + (i * 2) % 25,
      status,
      daysFromNow,
      hour,
      minute,
      clientMessage: CLIENT_MESSAGES[i % CLIENT_MESSAGES.length],
    };

    if (status === 'CONFIRMED' || status === 'COMPLETED') {
      spec.masterReply = MASTER_REPLIES[i % MASTER_REPLIES.length];
    }

    if (status === 'COMPLETED' && i % 3 === 0) {
      spec.followUpMessage = 'Спасибо, всё отлично!';
    }

    if (status === 'CANCELLED') {
      spec.cancelledBy = i % 2 === 0 ? 'CLIENT' : 'MASTER';
      spec.cancelReason = CANCEL_REASONS[i % CANCEL_REASONS.length];
      spec.masterReply = 'Жаль, что не получилось. Будем рады записать снова.';
    }

    if (status === 'NO_SHOW') {
      spec.masterReply = 'Не дозвонились — напишите, если нужно перенести.';
    }

    specs.push(spec);
  }

  return specs;
};

const buildStartsAt = (
  daysFromNow: number,
  hour: number,
  minute: number,
): Date => {
  const base = startOfDay(addDays(new Date(), daysFromNow));
  return setMinutes(setHours(base, hour), minute);
};

const pickClientId = (
  clients: { id: string }[],
  clientUserIndex: number,
  masterUserId: string,
): string => {
  const len = clients.length;
  if (len === 0) {
    throw new Error('appointments seed: no client users');
  }

  for (let attempt = 0; attempt < len; attempt += 1) {
    const user = clients[(clientUserIndex + attempt) % len];
    if (user.id !== masterUserId) {
      return user.id;
    }
  }

  throw new Error(
    'appointments seed: cannot pick client different from master user',
  );
};

export const appointmentsSeed: SeedRunner = async (
  prisma: PrismaClient,
): Promise<void> => {
  await prisma.appointmentChatMessage.deleteMany();
  await prisma.appointmentChat.deleteMany();
  await prisma.appointment.deleteMany();

  const profiles = await prisma.masterProfile.findMany({
    where: { deletedAt: null },
    include: {
      user: { select: { id: true } },
      services: {
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { displayName: 'asc' },
  });

  const profilesWithServices = profiles.filter((p) => p.services.length > 0);

  if (profilesWithServices.length < 8) {
    throw new Error(
      `appointments seed: need at least 8 master profiles with services, got ${profilesWithServices.length}`,
    );
  }

  const clients = await prisma.user.findMany({
    where: {
      deletedAt: null,
      status: 'ACTIVE',
      role: 'USER',
    },
    orderBy: { email: 'asc' },
    select: { id: true },
  });

  const specs = buildSpecs();
  let created = 0;

  for (const [index, spec] of specs.entries()) {
    const profile =
      profilesWithServices[spec.masterProfileIndex % profilesWithServices.length];
    const service = profile.services[spec.serviceIndex % profile.services.length];

    if (!service) {
      continue;
    }

    const clientUserId = pickClientId(
      clients,
      spec.clientUserIndex + index,
      profile.user.id,
    );

    const startsAt = buildStartsAt(spec.daysFromNow, spec.hour, spec.minute);
    const isCancelled = spec.status === 'CANCELLED';

    const messages: { senderUserId: string; body: string }[] = [];

    if (spec.clientMessage) {
      messages.push({
        senderUserId: clientUserId,
        body: spec.clientMessage,
      });
    }

    if (spec.masterReply) {
      messages.push({
        senderUserId: profile.user.id,
        body: spec.masterReply,
      });
    }

    if (spec.followUpMessage) {
      messages.push({
        senderUserId: clientUserId,
        body: spec.followUpMessage,
      });
    }

    await prisma.appointment.create({
      data: {
        masterProfileId: profile.id,
        masterServiceId: service.id,
        clientUserId,
        startsAt,
        durationMinutes: service.durationMinutes,
        status: spec.status,
        totalPrice: service.price,
        serviceName: service.name,
        cancelledAt: isCancelled ? addDays(startsAt, -1) : null,
        cancelledBy: isCancelled ? spec.cancelledBy ?? 'CLIENT' : null,
        cancelReason: isCancelled ? spec.cancelReason ?? null : null,
        chat: {
          create: {
            messages:
              messages.length > 0
                ? { create: messages }
                : undefined,
          },
        },
      },
    });

    created += 1;
  }

  const [appointmentCount, chatCount, messageCount] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointmentChat.count(),
    prisma.appointmentChatMessage.count(),
  ]);

  console.log(
    `appointments seed: ${appointmentCount} appointments, ${chatCount} chats, ${messageCount} messages (created ${created})`,
  );
};
