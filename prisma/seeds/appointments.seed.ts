import type {
  AppointmentCancelledBy,
  AppointmentStatus,
  PrismaClient,
} from '@prisma/client';
import { addDays, setHours, setMinutes, startOfDay } from 'date-fns';
import { SYSTEM_ROLE_IDS } from '../../src/modules/authorization/domain/entities/role/system-role-ids';
import { ERoleIdentifier } from '../../src/modules/authorization/domain/entities/role/role.enum';
import type { SeedRunner } from './index';

const EXTRA_APPOINTMENTS_PER_CLIENT = 5;
const EXTRA_GLOBAL_APPOINTMENTS = 400;
const CREATE_BATCH_SIZE = 25;
const MESSAGES_MIN = 8;
const MESSAGES_MAX = 22;

const CLIENT_MESSAGES = [
  'Первый раз записываюсь — подскажите, за сколько минут лучше приехать?',
  'Можно ли перенести на вечер, если появится окно?',
  'Есть аллергия на некоторые средства — учтите, пожалуйста.',
  'Нужна парковка рядом — подскажите, куда лучше встать.',
  'Хотелось бы тихое время, без суеты.',
  'Запишите, пожалуйста, на ближайшее удобное окно.',
  'Могу опоздать на 10–15 минут — предупреждаю заранее.',
  'После прошлого визита всё понравилось, повторяю услугу.',
  'Можно ли взять с собой ребёнка?',
  'Подскажите точный адрес и этаж.',
  'Есть ли предоплата или достаточно записи?',
  'Хочу уточнить длительность услуги.',
  'Можно ли сделать чуть раньше указанного времени?',
  'Нужен чек / акт для отчётности.',
  'Есть ли скидка при повторной записи?',
  'Можно ли изменить услугу уже после записи?',
  'Подскажите, что взять с собой.',
  'Будет ли мастер один или с ассистентом?',
  'Можно ли оплатить картой на месте?',
  'Хочу подтвердить, что запись активна.',
  'Если задержусь в пробке — как лучше предупредить?',
  'Можно ли разделить оплату на два платежа?',
  'Есть ли примеры работ похожего запроса?',
  'Нужна консультация перед началом.',
] as const;

const MASTER_MESSAGES = [
  'Принято, ждём вас в назначенное время.',
  'Ок, учту пожелания. Если что — напишите в чат.',
  'Запись подтверждена. До встречи!',
  'Можем сдвинуть на 30 минут позже — напишите, если удобно.',
  'Спасибо за предупреждение, перенесём при необходимости.',
  'Адрес отправил, ориентир — вход со двора.',
  'Предоплата не нужна, оплата после услуги.',
  'Длительность примерно как в карточке услуги.',
  'Картой можно, терминал есть.',
  'Да, запись активна и видна в расписании.',
  'Лучше предупредить за 15–20 минут — подстроимся.',
  'Могу показать примеры в похожем стиле.',
  'Ассистента не будет, работаю сам(а).',
  'Если нужно что-то уточнить по материалам — напишите.',
  'Чек подготовлю после завершения.',
  'Повторная запись — могу предложить удобное окно.',
  'Жаль, что не получилось. Будем рады записать снова.',
  'Не дозвонились — напишите, если нужно перенести.',
  'Всё готово к вашему визиту.',
  'Учту аллергию и подберу безопасный вариант.',
] as const;

const FOLLOW_UP_MESSAGES = [
  'Спасибо, всё отлично!',
  'Очень доволен результатом, до связи.',
  'Принято, до встречи!',
  'Ок, тогда до визита.',
  'Спасибо за ответы, всё понятно.',
  'Буду вовремя.',
  'Супер, забронировали.',
] as const;

const CANCEL_REASONS = [
  'Не получается приехать в это время',
  'Перенёс визит на другой день',
  'Изменились планы',
  'Записался к другому мастеру',
  'Семейные обстоятельства',
  'Проблемы с транспортом',
] as const;

type SeedService = {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  masterProfileId: string;
  masterUserId: string;
};

type AppointmentDraft = {
  masterProfileId: string;
  masterServiceId: string;
  masterUserId: string;
  clientUserId: string;
  startsAt: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  totalPrice: number;
  serviceName: string;
  cancelledAt: Date | null;
  cancelledBy: AppointmentCancelledBy | null;
  cancelReason: string | null;
  messageBodies: { senderUserId: string; body: string }[];
};

const pickStatus = (index: number): AppointmentStatus => {
  const bucket = index % 20;
  if (bucket < 3) return 'PENDING';
  if (bucket < 7) return 'CONFIRMED';
  if (bucket < 14) return 'COMPLETED';
  if (bucket < 17) return 'CANCELLED';
  return 'NO_SHOW';
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
  startIndex: number,
  masterUserId: string,
): string => {
  const len = clients.length;
  if (len === 0) {
    throw new Error('appointments seed: no client users');
  }

  for (let attempt = 0; attempt < len; attempt += 1) {
    const user = clients[(startIndex + attempt) % len];
    if (user.id !== masterUserId) {
      return user.id;
    }
  }

  throw new Error(
    'appointments seed: cannot pick client different from master user',
  );
};

const buildChatMessages = (params: {
  index: number;
  status: AppointmentStatus;
  clientUserId: string;
  masterUserId: string;
}): { senderUserId: string; body: string }[] => {
  const { index, status, clientUserId, masterUserId } = params;
  const count =
    MESSAGES_MIN + (index % (MESSAGES_MAX - MESSAGES_MIN + 1));

  const messages: { senderUserId: string; body: string }[] = [];

  for (let i = 0; i < count; i += 1) {
    const fromClient = i % 2 === 0;
    const senderUserId = fromClient ? clientUserId : masterUserId;
    const pool = fromClient ? CLIENT_MESSAGES : MASTER_MESSAGES;
    messages.push({
      senderUserId,
      body: pool[(index + i) % pool.length],
    });
  }

  if (status === 'COMPLETED' && index % 2 === 0) {
    messages.push({
      senderUserId: clientUserId,
      body: FOLLOW_UP_MESSAGES[index % FOLLOW_UP_MESSAGES.length],
    });
  }

  if (status === 'CANCELLED') {
    messages.push({
      senderUserId: masterUserId,
      body: 'Жаль, что не получилось. Будем рады записать снова.',
    });
  }

  if (status === 'NO_SHOW') {
    messages.push({
      senderUserId: masterUserId,
      body: 'Не дозвонились — напишите, если нужно перенести.',
    });
  }

  return messages;
};

const buildAppointmentDraft = (params: {
  service: SeedService;
  clientUserId: string;
  index: number;
  status: AppointmentStatus;
}): AppointmentDraft => {
  const { service, clientUserId, index, status } = params;

  const daysFromNow =
    status === 'COMPLETED' || status === 'NO_SHOW'
      ? -(2 + (index % 90))
      : status === 'CANCELLED'
        ? -(1 + (index % 30))
        : 1 + (index % 45);

  const hour = 9 + (index % 10);
  const minute = index % 2 === 0 ? 0 : 30;
  const startsAt = buildStartsAt(daysFromNow, hour, minute);
  const isCancelled = status === 'CANCELLED';

  return {
    masterProfileId: service.masterProfileId,
    masterServiceId: service.id,
    masterUserId: service.masterUserId,
    clientUserId,
    startsAt,
    durationMinutes: service.durationMinutes,
    status,
    totalPrice: service.price,
    serviceName: service.name,
    cancelledAt: isCancelled ? addDays(startsAt, -1) : null,
    cancelledBy: isCancelled
      ? index % 2 === 0
        ? 'CLIENT'
        : 'MASTER'
      : null,
    cancelReason: isCancelled
      ? CANCEL_REASONS[index % CANCEL_REASONS.length]
      : null,
    messageBodies: buildChatMessages({
      index,
      status,
      clientUserId,
      masterUserId: service.masterUserId,
    }),
  };
};

const chunkArray = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export const appointmentsSeed: SeedRunner = async (
  prisma: PrismaClient,
): Promise<void> => {
  await prisma.masterServiceReview.deleteMany();
  await prisma.appointmentChatMessage.deleteMany();
  await prisma.appointmentChat.deleteMany();
  await prisma.appointment.deleteMany();

  const servicesRaw = await prisma.masterService.findMany({
    where: { deletedAt: null },
    orderBy: [{ masterProfileId: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      price: true,
      durationMinutes: true,
      masterProfileId: true,
      masterProfile: {
        select: {
          userId: true,
          deletedAt: true,
        },
      },
    },
  });

  const services: SeedService[] = servicesRaw
    .filter((service) => service.masterProfile.deletedAt == null)
    .map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price,
      durationMinutes: service.durationMinutes,
      masterProfileId: service.masterProfileId,
      masterUserId: service.masterProfile.userId,
    }));

  if (services.length === 0) {
    throw new Error(
      'appointments seed: no active master services. Run masters seed first.',
    );
  }

  const clients = await prisma.user.findMany({
    where: {
      deletedAt: null,
      status: 'ACTIVE',
      roleId: SYSTEM_ROLE_IDS[ERoleIdentifier.USER],
    },
    orderBy: { email: 'asc' },
    select: { id: true },
  });

  if (clients.length < 2) {
    throw new Error(
      'appointments seed: need at least 2 active USER accounts for client/master pairs',
    );
  }

  const drafts: AppointmentDraft[] = [];
  let sequence = 0;

  // 1) На каждую услугу — COMPLETED-запись (для отзыва + чат)
  for (const [serviceIndex, service] of services.entries()) {
    const clientUserId = pickClientId(
      clients,
      serviceIndex,
      service.masterUserId,
    );
    drafts.push(
      buildAppointmentDraft({
        service,
        clientUserId,
        index: sequence,
        status: 'COMPLETED',
      }),
    );
    sequence += 1;
  }

  // 2) У каждого пользователя несколько записей/чатов с разными мастерами
  for (const [clientIndex, client] of clients.entries()) {
    for (let j = 0; j < EXTRA_APPOINTMENTS_PER_CLIENT; j += 1) {
      const service =
        services[(clientIndex * 3 + j * 7) % services.length];
      if (service.masterUserId === client.id) {
        continue;
      }

      drafts.push(
        buildAppointmentDraft({
          service,
          clientUserId: client.id,
          index: sequence,
          status: pickStatus(sequence),
        }),
      );
      sequence += 1;
    }
  }

  // 3) Дополнительный объём записей и переписок
  for (let i = 0; i < EXTRA_GLOBAL_APPOINTMENTS; i += 1) {
    const service = services[(i * 11) % services.length];
    const clientUserId = pickClientId(clients, i * 5 + 3, service.masterUserId);

    drafts.push(
      buildAppointmentDraft({
        service,
        clientUserId,
        index: sequence,
        status: pickStatus(sequence),
      }),
    );
    sequence += 1;
  }

  let createdAppointments = 0;
  let createdMessages = 0;

  for (const batch of chunkArray(drafts, CREATE_BATCH_SIZE)) {
    await Promise.all(
      batch.map(async (draft) => {
        const appointment = await prisma.appointment.create({
          data: {
            masterProfileId: draft.masterProfileId,
            masterServiceId: draft.masterServiceId,
            clientUserId: draft.clientUserId,
            startsAt: draft.startsAt,
            durationMinutes: draft.durationMinutes,
            status: draft.status,
            totalPrice: draft.totalPrice,
            serviceName: draft.serviceName,
            cancelledAt: draft.cancelledAt,
            cancelledBy: draft.cancelledBy,
            cancelReason: draft.cancelReason,
            chat: {
              create: {},
            },
          },
          select: {
            chat: { select: { id: true } },
          },
        });

        const chatId = appointment.chat?.id;
        if (!chatId) {
          throw new Error('appointments seed: chat was not created');
        }

        const messageResult = await prisma.appointmentChatMessage.createMany({
          data: draft.messageBodies.map((message) => ({
            chatId,
            senderUserId: message.senderUserId,
            body: message.body,
          })),
        });

        createdAppointments += 1;
        createdMessages += messageResult.count;
      }),
    );
  }

  const [appointmentCount, chatCount, messageCount, clientsInChats] =
    await Promise.all([
      prisma.appointment.count(),
      prisma.appointmentChat.count(),
      prisma.appointmentChatMessage.count(),
      prisma.appointment
        .groupBy({
          by: ['clientUserId'],
          where: { deletedAt: null },
        })
        .then((rows) => rows.length),
    ]);

  console.log(
    `appointments seed: ${appointmentCount} appointments, ${chatCount} chats, ${messageCount} messages (created ${createdAppointments}/${drafts.length}, messages ${createdMessages}, clients in chats ${clientsInChats}/${clients.length}, services covered ${services.length})`,
  );
};
