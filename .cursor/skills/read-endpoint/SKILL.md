---
name: read-endpoint
description: >-
  Adds a complete my-master-api read endpoint (get-one / get-many) vertical
  slice: domain entity/select-fields, repository, Prisma read, use-case, AJV
  schema, request mapper, response mapper, HTTP controller. Use when adding a
  list/get endpoint.
---

# Read endpoint (vertical slice)

## Building blocks

- Domain: `domain-entity`, `domain-repository`
- Infra: `prisma-repository`, `feature-module`
- Presentation: `presentation-http`, `authorize-kind`
- Sequence: `.cursor/rules/entity-creation-sequence.mdc`
- Query: `.cursor/rules/query-layer-and-presets.mdc`

## Etalon

- Masters list/get: `master-services.controller.ts` + request-mappers + get use-cases
- Full feature: `src/modules/masters/` (`master-service`, `master-profile`)

## Steps

1. Domain entity + `*-select-fields` + read port (`IReadRepository` intersection)
2. Prisma repo + row mapper + `*_VALIDATION_CONFIG`; bind in entity module
3. UC: `get-<entities>` (FindManyParams) / `get-<entity>-by-id` (actor + id + select)
4. Presentation:
   - list: filters schema, `extract-*-filter`, `preset-to-select-options`, `request-query-params-to-find-many-params`
   - by-id: `request-query-params-to-get-*-by-id-use-case-input`
   - response: `map-get-*-response` → `{ data, meta? }`
5. Controller + `@Authorize` / `@PublicEndpoint`
6. Wire modules

## Rules

- Field lists SoT = domain `*_SELECT_FIELDS`; presets inline in presentation mapper
- Visibility (`deletedAt: null` for non-staff) — в list **presentation** mapper
- Filters/sort = `FindManyParams` / `WhereFilter`, не Prisma в controller
- Empty list → `{ data: [], meta }` (200)
- No Prisma rows in HTTP response

## Checklist

- [ ] select-fields + read port + validation config
- [ ] UC without transport logic
- [ ] schema + mappers use domain select / staff-only helpers
- [ ] Controller thin + authorize
- [ ] Feature/entity module wiring
