import type { SearchTaxonomyExpansion } from '../../entities/search-query-expansion';

export interface ISearchTaxonomyReader {
  findExactMatch(
    normalizedQuery: string,
  ): Promise<SearchTaxonomyExpansion | null>;

  findFuzzyMatches(
    normalizedQuery: string,
    threshold: number,
    limit: number,
  ): Promise<SearchTaxonomyExpansion[]>;

  findFuzzyServiceIdsByName(
    normalizedQuery: string,
    threshold: number,
    limit: number,
  ): Promise<string[]>;
}

export const SEARCH_TAXONOMY_READER_TOKEN = Symbol('SEARCH_TAXONOMY_READER');
