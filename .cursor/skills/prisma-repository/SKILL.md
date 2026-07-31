---
name: prisma-repository
description: >-
  Implements my-master-api Prisma repository + relations + write-error mapper +
  row-mapper for a domain repository port. Use when adding or changing a Prisma
  repository, row mapper, or relations under a feature infrastructure/persistence.
---

# Prisma repository

## Read first

- Etalon: `src/modules/masters/infrastructure/persistence/repositories/master-service/`
- Row mapper: `…/row-mappers/master-service/`
- Base: `src/modules/shared/infrastructure/persistence/repositories/base/`
- Tx: `unwrapPrismaTxFromScope` in shared transactions
- Rules: `.cursor/rules/prisma-repository.mdc`, `prisma-boundary-and-types.mdc`, `query-layer-and-presets.mdc`
- Domain port must exist first (skill `domain-repository`)

## Output

```text
infrastructure/persistence/repositories/<entity>/
  prisma-<entity>.repository.ts
  <entity>.relations.ts              # *_VALIDATION_CONFIG (+ relationConfig)
  <entity>-write-error.mapper.ts
  index.ts                           # опционально

infrastructure/persistence/row-mappers/<entity>/
  <entity>.row.types.ts
  map-<entity>-row.ts
  index.ts
```

Register in feature Nest sub-module (`infrastructure/modules/<entity>/`):

`{ provide: <ENTITY>_REPOSITORY_TOKEN, useClass: Prisma<Entity>Repository }`

## Rules

- `extends PrismaReadRepository` + `implements I<Entity>Repository` (если есть list/preset)
- Writes: required `scope`, try/catch → `map<Entity>WriteError`
- `P2002` → AlreadyExists, `P2025` → NotFound, `P2003` → FK NotFound; else normalize unknown
- Update patch: только keys `!== undefined` (включая `null`)
- `mapRow` только делегирует в `mapXxxRow`; Decimal-like → `string`
- No business/ACL/enrichment/HTTP shaping
- PrismaService / `@prisma/client` только в infrastructure
- Auth-only без list — плоский Prisma-репозиторий без `PrismaReadRepository`

## Checklist

- [ ] Layout + row-mappers mirror etalon
- [ ] Domain port implemented; token bound in entity module
- [ ] Tx unwrap on writes; write-error mapper used
- [ ] Row mapper — единственная точка Prisma→domain
