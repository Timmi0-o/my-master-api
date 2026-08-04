import { SEARCH_MAX_EXPANDED_TERMS } from './search-query-expansion.constants';

export type SearchTaxonomyExpansion = {
  canonical: string;
  aliases: string[];
};

export type ExpandSearchQueryTermsInput = {
  normalizedQuery: string;
  exact: SearchTaxonomyExpansion | null;
  fuzzy: SearchTaxonomyExpansion[];
  maxTerms?: number;
};

export function expandSearchQueryTerms(
  input: ExpandSearchQueryTermsInput,
): string[] {
  const maxTerms = input.maxTerms ?? SEARCH_MAX_EXPANDED_TERMS;
  const terms: string[] = [];
  const seen = new Set<string>();

  const push = (term: string) => {
    if (!term || seen.has(term) || terms.length >= maxTerms) {
      return;
    }
    seen.add(term);
    terms.push(term);
  };

  push(input.normalizedQuery);

  const expansions = [...(input.exact ? [input.exact] : []), ...input.fuzzy];

  for (const expansion of expansions) {
    push(expansion.canonical);
    for (const alias of expansion.aliases) {
      push(alias);
    }
  }

  return terms;
}
