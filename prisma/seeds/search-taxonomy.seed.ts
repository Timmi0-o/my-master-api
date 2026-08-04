import * as fs from 'node:fs';
import * as path from 'node:path';
import type { MasterServiceCategory, PrismaClient } from '@prisma/client';
import type { SeedRunner } from './index';
import { normalizeSearchTaxonomyTerm } from './search-taxonomy/build-search-taxonomy';

type SearchTaxonomyFile = {
  entries: Array<{
    value: string;
    category: MasterServiceCategory | null;
    aliases: string[];
  }>;
};

function loadSearchTaxonomyEntries(): SearchTaxonomyFile['entries'] {
  const filePath = path.join(__dirname, 'data', 'search-taxonomy.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Missing ${filePath}. Run: npm run prisma:generate:search-taxonomy`,
    );
  }

  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as SearchTaxonomyFile;
  if (!Array.isArray(raw.entries) || raw.entries.length === 0) {
    throw new Error(`search-taxonomy.json has no entries: ${filePath}`);
  }

  return raw.entries;
}

export const searchTaxonomySeed: SeedRunner = async (prisma: PrismaClient) => {
  const entries = loadSearchTaxonomyEntries();

  for (const entry of entries) {
    const canonicalValue = normalizeSearchTaxonomyTerm(entry.value);
    const canonical = await prisma.searchCanonicalTag.upsert({
      where: { value: canonicalValue },
      create: {
        value: canonicalValue,
        category: entry.category,
      },
      update: {
        category: entry.category,
      },
    });

    const aliases = [
      ...new Set(
        entry.aliases
          .map(normalizeSearchTaxonomyTerm)
          .filter((alias) => alias && alias !== canonicalValue),
      ),
    ];

    for (const alias of aliases) {
      await prisma.searchSynonym.upsert({
        where: { alias },
        create: {
          alias,
          canonicalTagId: canonical.id,
        },
        update: {
          canonicalTagId: canonical.id,
        },
      });
    }
  }
};
