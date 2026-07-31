---
name: feature-module
description: >-
  Wires my-master-api Nest feature / entity modules (useFactory use-cases,
  repository tokens, controllers on feature facade). Use when registering
  providers, binding tokens, or adding a feature/entity module under
  src/modules/<feature>.
---

# Feature module

## Read first

- Etalon entity module: `src/modules/masters/infrastructure/modules/master-service/master-service.module.ts`
- Feature facade: `src/modules/masters/masters.module.ts`
- Shared globals: Prisma / TX / filters via `shared` modules
- Rule: `.cursor/rules/feature-modules.mdc`
- Sequence: `.cursor/rules/entity-creation-sequence.mdc` (фаза 6)

## Output

```text
src/modules/<feature>/
  <feature>.module.ts                          # facade: imports entity modules + controllers
  infrastructure/modules/<entity>/<entity>.module.ts
```

## Pattern

```ts
{
  provide: MASTER_SERVICE_REPOSITORY_TOKEN,
  useClass: PrismaMasterServiceRepository,
},
{
  provide: CreateMasterServiceUseCase,
  useFactory: (tx: ITransactionManager, repo: IMasterServiceRepository, …) =>
    new CreateMasterServiceUseCase(tx, repo, …),
  inject: [TRANSACTION_MANAGER_TOKEN, MASTER_SERVICE_REPOSITORY_TOKEN, …],
},
```

Facade feature module:

- `imports`: entity sub-modules (+ cross-feature modules)
- `controllers`: HTTP controllers (не в entity module, если так принято в feature — смотри соседей)
- Export `*_REPOSITORY_TOKEN` / UC только если нужны другим модулям

## Rules

- UC: plain class; `{ provide: UseCase, useFactory, inject }` — inject order = ctor order
- Repo: `{ provide: TOKEN, useClass: Prisma* }` в entity module
- Application ports (realtime publisher и т.п.): `useClass` / `useFactory` рядом с UC
- Не re-provide глобальные Prisma / TRANSACTION_MANAGER / DomainExceptionFilter
- Controllers **не** инжектят репозитории — только use-cases
- Новый feature → `imports` в `src/app.module.ts`

## Checklist

- [ ] Repo / ports / UC wired
- [ ] inject order = ctor order
- [ ] Entity module imported by feature facade
- [ ] Controllers без repository tokens
- [ ] AppModule updated if new feature
