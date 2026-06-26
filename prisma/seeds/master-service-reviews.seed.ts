import type { PrismaClient } from '@prisma/client';
import type { SeedRunner } from './index';

const REVIEW_TEXTS_BY_RATING: Record<number, readonly string[]> = {
  5: [
    'Всё прошло идеально, мастер очень внимательный. Обязательно вернусь!',
    'Отличный сервис, аккуратная работа и приятная атмосфера.',
    'Результат превзошёл ожидания, рекомендую всем знакомым.',
    'Пунктуально, профессионально, без лишней суеты. Спасибо!',
    'Очень доволен визитом — видно, что мастер любит своё дело.',
    'Качество на высоте, цена адекватная. Буду записываться снова.',
    'Внимание к деталям и хорошие рекомендации по уходу после услуги.',
    'Лучший опыт за последнее время, сервис на уровне.',
  ],
  4: [
    'В целом всё понравилось, небольшая задержка по времени, но результат хороший.',
    'Качественно сделали, есть пара мелочей, но в целом рекомендую.',
    'Хороший мастер, комфортно и аккуратно. Вернусь ещё раз.',
    'Услуга выполнена хорошо, чуть дольше, чем ожидал, но это не критично.',
    'Приятное обслуживание и достойный результат за свои деньги.',
    'Почти идеально — одна деталь могла бы быть лучше, но я доволен.',
  ],
  3: [
    'Нормально, без восторга. Средний опыт, ничего особенного.',
    'Результат приемлемый, но ожидал чуть большего за эту цену.',
    'Справились с задачей, но сервис мог бы быть внимательнее.',
    'Средне: не плохо, но есть куда расти по коммуникации.',
  ],
  2: [
    'Ожидания не оправдались, пришлось уточнять детали по ходу работы.',
    'Результат слабоват, придётся искать другого мастера.',
    'Долго ждал начала, качество ниже заявленного уровня.',
  ],
  1: [
    'Очень разочарован, пришлось переделывать у другого специалиста.',
    'Не рекомендую — сервис и результат не соответствуют описанию.',
  ],
} as const;

const pickRating = (index: number): number => {
  const bucket = index % 20;
  if (bucket < 10) return 5;
  if (bucket < 15) return 4;
  if (bucket < 18) return 3;
  if (bucket < 19) return 2;
  return 1;
};

const pickReviewText = (rating: number, index: number): string => {
  const texts = REVIEW_TEXTS_BY_RATING[rating] ?? REVIEW_TEXTS_BY_RATING[4];
  return texts[index % texts.length];
};

const shouldSkipReview = (index: number): boolean => index % 7 === 0;

export const masterServiceReviewsSeed: SeedRunner = async (
  prisma: PrismaClient,
): Promise<void> => {
  await prisma.masterServiceReview.deleteMany();

  const completedAppointments = await prisma.appointment.findMany({
    where: {
      status: 'COMPLETED',
      deletedAt: null,
    },
    orderBy: { startsAt: 'asc' },
    select: {
      id: true,
      clientUserId: true,
      masterServiceId: true,
      serviceName: true,
    },
  });

  if (completedAppointments.length === 0) {
    throw new Error(
      'master-service-reviews seed: no COMPLETED appointments. Run appointments seed first.',
    );
  }

  let created = 0;

  for (const [index, appointment] of completedAppointments.entries()) {
    if (shouldSkipReview(index)) {
      continue;
    }

    const rating = pickRating(index);
    const text = pickReviewText(rating, index);

    await prisma.masterServiceReview.create({
      data: {
        clientUserId: appointment.clientUserId,
        masterServiceId: appointment.masterServiceId,
        appointmentId: appointment.id,
        rating,
        text: `${text} (услуга: ${appointment.serviceName})`,
      },
    });

    created += 1;
  }

  const reviewCount = await prisma.masterServiceReview.count();

  console.log(
    `master-service-reviews seed: ${reviewCount} reviews (created ${created} from ${completedAppointments.length} completed appointments)`,
  );
};
