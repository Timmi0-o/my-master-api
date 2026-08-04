import type { MasterServiceCategory } from '@prisma/client';
import type { CuratedSearchTaxonomyEntry } from './curated-search-taxonomy';

export type SearchTaxonomySeedEntry = {
  value: string;
  category: MasterServiceCategory | null;
  aliases: string[];
};

export type AbramovWord = {
  id: number;
  name: string;
  definition?: string;
  synonyms?: string[];
  similars?: string[];
};

export type AbramovDictionary = {
  title?: string;
  author?: string;
  wordlist: AbramovWord[];
};

const MAX_ALIASES_PER_CANON = 40;
const MAX_SEE_DEPTH = 2;
const MAX_ALIAS_LENGTH = 50;

export function normalizeSearchTaxonomyTerm(value: string): string {
  return value.trim().toLowerCase().replaceAll('ё', 'е');
}

function cleanAliasToken(raw: string): string | null {
  let token = normalizeSearchTaxonomyTerm(raw);
  token = token.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  token = token.replace(/[.,;:!?]+$/g, '').trim();

  if (token.length < 2 || token.length > MAX_ALIAS_LENGTH) {
    return null;
  }

  if (
    /[;|]/.test(token) ||
    /^см\b/i.test(token) ||
    /^ср\b/i.test(token) ||
    /^прот\b/i.test(token)
  ) {
    return null;
  }

  return token;
}

function tokenizeDictionaryPhrase(raw: string): string[] {
  return raw
    .split(';')
    .map((part) => cleanAliasToken(part))
    .filter((part): part is string => part != null);
}

function parseSeeReferences(definition: string | undefined): string[] {
  if (!definition) {
    return [];
  }

  const match = definition.match(/см\.\s*([^|]+)/i);
  if (!match?.[1]) {
    return [];
  }

  return match[1]
    .split(',')
    .map((part) => cleanAliasToken(part))
    .filter((part): part is string => part != null);
}

export function buildAbramovIndex(
  dictionary: AbramovDictionary,
): Map<string, AbramovWord> {
  const index = new Map<string, AbramovWord>();

  for (const word of dictionary.wordlist) {
    const key = normalizeSearchTaxonomyTerm(word.name);
    if (!key || index.has(key)) {
      continue;
    }
    index.set(key, word);
  }

  return index;
}

export function resolveDictionaryAliases(
  term: string,
  index: Map<string, AbramovWord>,
  depth = 0,
  visited: Set<string> = new Set(),
): string[] {
  const normalized = normalizeSearchTaxonomyTerm(term);
  if (!normalized || visited.has(normalized) || depth > MAX_SEE_DEPTH) {
    return [];
  }
  visited.add(normalized);

  const entry = index.get(normalized);
  if (!entry) {
    return [];
  }

  const direct = [...(entry.synonyms ?? []), ...(entry.similars ?? [])]
    .flatMap((item) => tokenizeDictionaryPhrase(item))
    .filter((item) => item !== normalized);

  if (direct.length > 0) {
    return [...new Set(direct)];
  }

  const seeRefs = parseSeeReferences(entry.definition);
  const nested: string[] = [];
  for (const ref of seeRefs) {
    nested.push(ref);
    nested.push(
      ...resolveDictionaryAliases(ref, index, depth + 1, visited),
    );
  }

  return [...new Set(nested.filter((item) => item !== normalized))];
}

type MutableCanon = {
  value: string;
  category: MasterServiceCategory | null;
  aliases: Set<string>;
};

function addAlias(
  canons: Map<string, MutableCanon>,
  aliasOwner: Map<string, string>,
  canonicalValue: string,
  aliasRaw: string,
): void {
  const alias = cleanAliasToken(aliasRaw);
  if (!alias || alias === canonicalValue) {
    return;
  }

  if (canons.has(alias)) {
    return;
  }

  const existingOwner = aliasOwner.get(alias);
  if (existingOwner && existingOwner !== canonicalValue) {
    return;
  }

  const canon = canons.get(canonicalValue);
  if (!canon || canon.aliases.size >= MAX_ALIASES_PER_CANON) {
    return;
  }

  canon.aliases.add(alias);
  aliasOwner.set(alias, canonicalValue);
}

function ensureCanon(
  canons: Map<string, MutableCanon>,
  valueRaw: string,
  category: MasterServiceCategory | null,
): string | null {
  const value = normalizeSearchTaxonomyTerm(valueRaw);
  if (!value) {
    return null;
  }

  const existing = canons.get(value);
  if (existing) {
    if (existing.category == null && category != null) {
      existing.category = category;
    }
    return value;
  }

  canons.set(value, {
    value,
    category,
    aliases: new Set(),
  });
  return value;
}

function enrichCanonFromDictionary(
  canons: Map<string, MutableCanon>,
  aliasOwner: Map<string, string>,
  index: Map<string, AbramovWord>,
  canonicalValue: string,
  lookupTerms: string[],
): void {
  for (const lookup of lookupTerms) {
    for (const alias of resolveDictionaryAliases(lookup, index)) {
      addAlias(canons, aliasOwner, canonicalValue, alias);
    }
  }
}

export function buildSearchTaxonomySeedEntries(input: {
  curated: CuratedSearchTaxonomyEntry[];
  catalogTags: Map<string, MasterServiceCategory>;
  dictionary: AbramovDictionary;
}): SearchTaxonomySeedEntry[] {
  const index = buildAbramovIndex(input.dictionary);
  const canons = new Map<string, MutableCanon>();
  const aliasOwner = new Map<string, string>();

  for (const entry of input.curated) {
    const canonical = ensureCanon(canons, entry.value, entry.category);
    if (!canonical) {
      continue;
    }

    for (const alias of entry.aliases) {
      addAlias(canons, aliasOwner, canonical, alias);
    }

    enrichCanonFromDictionary(canons, aliasOwner, index, canonical, [
      canonical,
      ...entry.aliases.map(normalizeSearchTaxonomyTerm),
    ]);
  }

  for (const [tagRaw, category] of input.catalogTags) {
    const tag = normalizeSearchTaxonomyTerm(tagRaw);
    if (!tag) {
      continue;
    }

    const ownedBy = canons.has(tag) ? tag : aliasOwner.get(tag);
    if (ownedBy) {
      enrichCanonFromDictionary(canons, aliasOwner, index, ownedBy, [tag]);
      continue;
    }

    if (!index.has(tag)) {
      continue;
    }

    const dictionaryAliases = resolveDictionaryAliases(tag, index);
    if (dictionaryAliases.length === 0) {
      continue;
    }

    const canonical = ensureCanon(canons, tag, category);
    if (!canonical) {
      continue;
    }

    for (const alias of dictionaryAliases) {
      addAlias(canons, aliasOwner, canonical, alias);
    }
  }

  return [...canons.values()]
    .map((canon) => ({
      value: canon.value,
      category: canon.category,
      aliases: [...canon.aliases].sort((a, b) => a.localeCompare(b, 'ru')),
    }))
    .sort((a, b) => a.value.localeCompare(b.value, 'ru'));
}
