import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import type { SearchTaxonomyExpansion } from 'src/modules/search/domain/entities/search-query-expansion';
import type { ISearchTaxonomyReader } from 'src/modules/search/domain/repositories/search-taxonomy';

type ExpansionRow = {
  canonical: string;
  aliases: string[] | null;
};

@Injectable()
export class PrismaSearchTaxonomyReader implements ISearchTaxonomyReader {
  constructor(private readonly prisma: PrismaService) {}

  async findExactMatch(
    normalizedQuery: string,
  ): Promise<SearchTaxonomyExpansion | null> {
    if (!normalizedQuery) {
      return null;
    }

    const rows = await this.prisma.$queryRaw<ExpansionRow[]>(Prisma.sql`
      WITH candidates AS (
        SELECT c.id AS canonical_id, c.value AS canonical, 1 AS priority
        FROM "SearchSynonyms" AS s
        INNER JOIN "SearchCanonicalTags" AS c ON c.id = s.canonical_tag_id
        WHERE s.alias = ${normalizedQuery}
        UNION ALL
        SELECT c.id AS canonical_id, c.value AS canonical, 2 AS priority
        FROM "SearchCanonicalTags" AS c
        WHERE c.value = ${normalizedQuery}
      ),
      matched AS (
        SELECT canonical_id, canonical
        FROM candidates
        ORDER BY priority ASC
        LIMIT 1
      )
      SELECT
        m.canonical,
        COALESCE(
          array_agg(DISTINCT syn.alias) FILTER (WHERE syn.alias IS NOT NULL),
          ARRAY[]::TEXT[]
        ) AS aliases
      FROM matched AS m
      LEFT JOIN "SearchSynonyms" AS syn ON syn.canonical_tag_id = m.canonical_id
      GROUP BY m.canonical
    `);

    const row = rows[0];
    if (!row) {
      return null;
    }

    return {
      canonical: row.canonical,
      aliases: row.aliases ?? [],
    };
  }

  async findFuzzyMatches(
    normalizedQuery: string,
    threshold: number,
    limit: number,
  ): Promise<SearchTaxonomyExpansion[]> {
    if (!normalizedQuery || limit <= 0) {
      return [];
    }

    const rows = await this.prisma.$queryRaw<ExpansionRow[]>(Prisma.sql`
      WITH hits AS (
        SELECT
          c.id AS canonical_id,
          similarity(s.alias, ${normalizedQuery}) AS score
        FROM "SearchSynonyms" AS s
        INNER JOIN "SearchCanonicalTags" AS c ON c.id = s.canonical_tag_id
        WHERE s.alias % ${normalizedQuery}
          AND similarity(s.alias, ${normalizedQuery}) >= ${threshold}
        UNION ALL
        SELECT
          c.id AS canonical_id,
          similarity(c.value, ${normalizedQuery}) AS score
        FROM "SearchCanonicalTags" AS c
        WHERE c.value % ${normalizedQuery}
          AND similarity(c.value, ${normalizedQuery}) >= ${threshold}
      ),
      ranked AS (
        SELECT canonical_id, MAX(score) AS score
        FROM hits
        GROUP BY canonical_id
        ORDER BY score DESC
        LIMIT ${limit}
      )
      SELECT
        c.value AS canonical,
        COALESCE(
          array_agg(DISTINCT syn.alias) FILTER (WHERE syn.alias IS NOT NULL),
          ARRAY[]::TEXT[]
        ) AS aliases
      FROM ranked AS r
      INNER JOIN "SearchCanonicalTags" AS c ON c.id = r.canonical_id
      LEFT JOIN "SearchSynonyms" AS syn ON syn.canonical_tag_id = c.id
      GROUP BY c.value, r.score
      ORDER BY r.score DESC
    `);

    return rows.map((row) => ({
      canonical: row.canonical,
      aliases: row.aliases ?? [],
    }));
  }

  async findFuzzyServiceIdsByName(
    normalizedQuery: string,
    threshold: number,
    limit: number,
  ): Promise<string[]> {
    if (!normalizedQuery || limit <= 0) {
      return [];
    }

    const rows = await this.prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT ms.id
      FROM "MasterServices" AS ms
      WHERE ms.deleted_at IS NULL
        AND ms.name % ${normalizedQuery}
        AND similarity(ms.name, ${normalizedQuery}) >= ${threshold}
      ORDER BY similarity(ms.name, ${normalizedQuery}) DESC
      LIMIT ${limit}
    `);

    return rows.map((row) => row.id);
  }
}
