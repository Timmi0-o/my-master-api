import {
  expandSearchQueryTerms,
  normalizeSearchQuery,
} from 'src/modules/search/domain/entities/search-query-expansion';

describe('normalizeSearchQuery', () => {
  it('trims, lowercases and maps ё to е', () => {
    expect(normalizeSearchQuery('  Ноготочки  ')).toBe('ноготочки');
    expect(normalizeSearchQuery('Съёмка')).toBe('съемка');
  });
});

describe('expandSearchQueryTerms', () => {
  it('always includes the normalized query', () => {
    expect(
      expandSearchQueryTerms({
        normalizedQuery: 'foo',
        exact: null,
        fuzzy: [],
      }),
    ).toEqual(['foo']);
  });

  it('expands exact synonym match to canonical and aliases', () => {
    expect(
      expandSearchQueryTerms({
        normalizedQuery: 'ноготочки',
        exact: {
          canonical: 'маникюр',
          aliases: ['ноготочки', 'ногти', 'nails'],
        },
        fuzzy: [],
      }),
    ).toEqual(['ноготочки', 'маникюр', 'ногти', 'nails']);
  });

  it('dedupes and respects maxTerms', () => {
    expect(
      expandSearchQueryTerms({
        normalizedQuery: 'маникюр',
        exact: {
          canonical: 'маникюр',
          aliases: ['ноготочки', 'ногти'],
        },
        fuzzy: [
          {
            canonical: 'педикюр',
            aliases: ['стопы'],
          },
        ],
        maxTerms: 3,
      }),
    ).toEqual(['маникюр', 'ноготочки', 'ногти']);
  });

  it('merges fuzzy expansions when exact is missing', () => {
    expect(
      expandSearchQueryTerms({
        normalizedQuery: 'маникюрр',
        exact: null,
        fuzzy: [
          {
            canonical: 'маникюр',
            aliases: ['ноготочки', 'ногти'],
          },
        ],
      }),
    ).toEqual(['маникюрр', 'маникюр', 'ноготочки', 'ногти']);
  });
});
