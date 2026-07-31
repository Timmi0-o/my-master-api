---
name: domain-repository
description: >-
  Scaffolds my-master-api domain repository port (ISP intersection + Symbol
  token + barrel) inside a feature module. Use when adding or changing a
  persistence port under src/modules/<feature>/domain/repositories.
---

# Domain repository port

Создаёт persistence-порт в `src/modules/<feature>/domain/repositories/<entity>/`.

## Read first

- Etalon: `src/modules/masters/domain/repositories/master-service/i-master-service.repository.ts`
- Capability ports: `src/modules/shared/domain/repositories/i-*.repository.ts`
- Rule: `.cursor/rules/domain-repositories.mdc`
- Sequence: `.cursor/rules/entity-creation-sequence.mdc` (фаза 2.3)

## Output

```text
domain/repositories/<entity>/
  i-<entity>.repository.ts
  <entity>.repository.tokens.ts
  index.ts
```

## Pattern

```ts
// <entity>.repository.tokens.ts
export const MASTER_SERVICE_REPOSITORY_TOKEN = Symbol('MASTER_SERVICE_REPOSITORY_TOKEN');

// i-<entity>.repository.ts
export type IMasterServiceRepository = IReadRepository<
  IMasterServicePublicEntity,
  string,
  IMasterServiceRelations
> &
  ICreateRepository<IMasterServiceEntity, ICreateMasterServiceInput> &
  IUpdateRepository<IMasterServiceEntity, string, IUpdateMasterServiceInput> &
  ISoftDeleteRepository<IMasterServiceEntity, string> & {
    findEntityById(id: string, scope?: TransactionScope): Promise<IMasterServiceEntity | null>;
  };
```

Спец-методы (approve, stats, exists) — узкие методы на том же порте или отдельный port + TOKEN, не god-interface.

Auth-only сущности без list (session/refresh) — плоский interface без `IReadRepository`.

## Rules

- Только `type` intersection узких ISP-портов из `@shared/domain/repositories`
- Entity/inputs — из `domain/entities/<entity>/`
- Write-методы требуют `TransactionScope`
- Один репозиторий на агрегат (read + write вместе)
- **Не** импортировать Prisma / Nest / presentation
- **Не** использовать `PrismaCrudRepository`

## Checklist

- [ ] Зеркало `entities/<entity>`
- [ ] TOKEN + intersection (или узкий custom)
- [ ] Barrel
- [ ] Нет лишних capability «на будущее»
