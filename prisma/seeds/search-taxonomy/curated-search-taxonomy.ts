import type { MasterServiceCategory } from '@prisma/client';

export type CuratedSearchTaxonomyEntry = {
  value: string;
  category: MasterServiceCategory;
  aliases: string[];
};

/** Hand-curated marketplace canons (slang, EN, domain terms missing from Abramov). */
export const CURATED_SEARCH_TAXONOMY: CuratedSearchTaxonomyEntry[] = [
  {
    value: 'маникюр',
    category: 'BEAUTY',
    aliases: [
      'ноготочки',
      'ноготки',
      'ногти',
      'nails',
      'manicure',
      'гель-лак',
      'покрытие',
      'nail',
    ],
  },
  {
    value: 'педикюр',
    category: 'BEAUTY',
    aliases: ['pedicure', 'стопы', 'аппаратный педикюр'],
  },
  {
    value: 'стрижка',
    category: 'BEAUTY',
    aliases: ['haircut', 'барбер', 'фейд', 'укладка волос'],
  },
  {
    value: 'сантехника',
    category: 'HOME',
    aliases: ['сантехник', 'кран', 'смеситель', 'засор', 'plumbing'],
  },
  {
    value: 'шиномонтаж',
    category: 'AUTO',
    aliases: ['шины', 'колёса', 'колеса', 'балансировка', 'прокол'],
  },
  {
    value: 'фотосессия',
    category: 'PHOTO',
    aliases: ['фото', 'съёмка', 'съемка', 'портрет', 'photography'],
  },
];
