---
name: domain-entity
description: >-
  Scaffolds my-master-api domain entity (interface, inputs, select-fields,
  policies, errors, barrels) inside a feature module. Use when adding or
  changing a domain model under src/modules/<feature>/domain/entities, or when
  the user asks for a new entity / policies / entity errors.
---

# Domain entity

Создаёт ядро сущности в `src/modules/<feature>/domain/entities/<entity>/` по канону my-master-api.

## Read first

- Rule: `.cursor/rules/domain-entities.mdc`
- Sequence: `.cursor/rules/entity-creation-sequence.mdc`
- Etalon: `src/modules/masters/domain/entities/master-service/`
- Architecture: `.cursor/rules/architecture-ddd-clean.mdc`

## Output

```text
src/modules/<feature>/domain/entities/<entity>/
  i-<entity>.entity.ts              # I*Entity (+ I*PublicEntity если нужно)
  i-<entity>-relations.ts           # только если есть includes
  i-create-<entity>.input.ts
  i-update-<entity>.input.ts
  <entity>-select-fields.ts         # *_SELECT_FIELDS + *_STAFF_ONLY_FIELDS
  <topic>.enum.ts / constants       # опционально
  policies/{topic}.policy.ts        # + policies/index.ts
  errors/{reason}.error.ts          # + errors/index.ts
  index.ts
```

Параллельно (если нужен read/write): skills `domain-repository`, затем `prisma-repository`.

## Rules

- Entity = `interface I{Entity}Entity` (**не** class-aggregate); Decimal/money → `string`
- Public vs full: секреты (`passwordHash`) — отдельная full entity; иначе Public ≈ Entity
- Create input: обязательные поля обязательны; DB-defaults — `?`; без timestamps
- Update input: все `?`; `null` = очистить, `undefined` = не трогать; без id/timestamps
- Policies: pure (`ensure*Exists`, `ensure*Accessible`, `ensure*Cancellable`); `asserts` где уместно; без I/O
- Errors: типизированные domain errors co-located в `errors/`
- Select lists — SoT в entity-папке (`*_SELECT_FIELDS`); presets живут в presentation mappers
- **Запрещено:** Nest / Prisma / AJV / infrastructure / presentation imports

## Checklist

- [ ] Прочитал etalon `master-service`
- [ ] Папка `<entity>` kebab-case, singular; feature выбран
- [ ] Barrel + policies/errors index
- [ ] Нет импортов infrastructure/presentation
- [ ] При необходимости создал repository port
