import {
  buildAbramovIndex,
  buildSearchTaxonomySeedEntries,
  resolveDictionaryAliases,
  type AbramovDictionary,
} from '../../../../../../../prisma/seeds/search-taxonomy/build-search-taxonomy';
import type { CuratedSearchTaxonomyEntry } from '../../../../../../../prisma/seeds/search-taxonomy/curated-search-taxonomy';

const dictionary: AbramovDictionary = {
  wordlist: [
    {
      id: 1,
      name: 'красота',
      synonyms: ['краса', 'изящество'],
      similars: ['благолепие'],
    },
    {
      id: 2,
      name: 'ремонт',
      definition: 'см. исправление, улучшение || производить ремонт',
    },
    {
      id: 3,
      name: 'исправление',
      synonyms: ['поправка', 'починка'],
    },
    {
      id: 4,
      name: 'улучшение',
      synonyms: ['совершенствование'],
    },
  ],
};

describe('buildSearchTaxonomySeedEntries', () => {
  it('keeps curated aliases and enriches from dictionary', () => {
    const curated: CuratedSearchTaxonomyEntry[] = [
      {
        value: 'маникюр',
        category: 'BEAUTY',
        aliases: ['ноготочки', 'красота'],
      },
    ];

    const catalogTags = new Map([
      ['красота', 'BEAUTY' as const],
      ['ремонт', 'REPAIR' as const],
      ['гель-лак', 'BEAUTY' as const],
    ]);

    const entries = buildSearchTaxonomySeedEntries({
      curated,
      catalogTags,
      dictionary,
    });

    const manicure = entries.find((entry) => entry.value === 'маникюр');
    expect(manicure?.aliases).toEqual(
      expect.arrayContaining(['ноготочки', 'краса', 'изящество', 'благолепие']),
    );

    const repair = entries.find((entry) => entry.value === 'ремонт');
    expect(repair?.category).toBe('REPAIR');
    expect(repair?.aliases).toEqual(
      expect.arrayContaining([
        'исправление',
        'поправка',
        'починка',
        'улучшение',
      ]),
    );

    expect(entries.find((entry) => entry.value === 'гель-лак')).toBeUndefined();
  });

  it('resolves см. references via dictionary index', () => {
    const index = buildAbramovIndex(dictionary);
    expect(resolveDictionaryAliases('ремонт', index)).toEqual(
      expect.arrayContaining([
        'исправление',
        'поправка',
        'починка',
        'улучшение',
      ]),
    );
  });
});
