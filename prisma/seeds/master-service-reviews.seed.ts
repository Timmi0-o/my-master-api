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
    'Супер! Всё четко, чисто и по делу.',
    'Мастер объяснил каждый шаг, результат именно как хотел.',
    'Пять звёзд без сомнений — рекомендую.',
    'Быстро, аккуратно и с отличным настроением.',
  ],
  4: [
    'В целом всё понравилось, небольшая задержка по времени, но результат хороший.',
    'Качественно сделали, есть пара мелочей, но в целом рекомендую.',
    'Хороший мастер, комфортно и аккуратно. Вернусь ещё раз.',
    'Услуга выполнена хорошо, чуть дольше, чем ожидал, но это не критично.',
    'Приятное обслуживание и достойный результат за свои деньги.',
    'Почти идеально — одна деталь могла бы быть лучше, но я доволен.',
    'Хороший опыт, буду рекомендовать друзьям.',
    'Всё ок, небольшие замечания по коммуникации.',
  ],
  3: [
    'Нормально, без восторга. Средний опыт, ничего особенного.',
    'Результат приемлемый, но ожидал чуть большего за эту цену.',
    'Справились с задачей, но сервис мог бы быть внимательнее.',
    'Средне: не плохо, но есть куда расти по коммуникации.',
    'Нейтрально — сделали, но без вау-эффекта.',
    'Ожидал чуть более персонального подхода.',
  ],
  2: [
    'Ожидания не оправдались, пришлось уточнять детали по ходу работы.',
    'Результат слабоват, придётся искать другого мастера.',
    'Долго ждал начала, качество ниже заявленного уровня.',
    'Есть претензии к итогу, но частично задачу закрыли.',
    'Коммуникация хромала, результат средний минус.',
  ],
  1: [
    'Очень разочарован, пришлось переделывать у другого специалиста.',
    'Не рекомендую — сервис и результат не соответствуют описанию.',
    'Плохой опыт: опоздание и слабый результат.',
    'Не совпало с ожиданиями совсем.',
  ],
} as const;

const CREATE_BATCH_SIZE = 100;

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

const chunkArray = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

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

  const reviewRows = completedAppointments.map((appointment, index) => {
    const rating = pickRating(index);
    const text = pickReviewText(rating, index);

    return {
      clientUserId: appointment.clientUserId,
      masterServiceId: appointment.masterServiceId,
      appointmentId: appointment.id,
      rating,
      text: `${text} (услуга: ${appointment.serviceName})`,
    };
  });

  let created = 0;

  for (const batch of chunkArray(reviewRows, CREATE_BATCH_SIZE)) {
    const result = await prisma.masterServiceReview.createMany({
      data: batch,
      skipDuplicates: true,
    });
    created += result.count;
  }

  const [reviewCount, servicesWithReviews, totalServices] = await Promise.all([
    prisma.masterServiceReview.count(),
    prisma.masterServiceReview
      .groupBy({
        by: ['masterServiceId'],
        where: { deletedAt: null },
      })
      .then((rows) => rows.length),
    prisma.masterService.count({ where: { deletedAt: null } }),
  ]);

  console.log(
    `master-service-reviews seed: ${reviewCount} reviews (created ${created} from ${completedAppointments.length} completed appointments; services with reviews ${servicesWithReviews}/${totalServices})`,
  );
};
