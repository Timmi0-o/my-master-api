---
name: write-endpoint
description: >-
  Adds a complete my-master-api write endpoint (create/update/delete/action)
  vertical slice with domain inputs/policies, transactional use-case, Prisma
  write, AJV schema, request mappers, HTTP controller. Use when adding a
  create/update/delete or action endpoint.
---

# Write endpoint (vertical slice)

## Building blocks

- Domain: `domain-entity`, `domain-repository`, policies/errors
- Infra: `prisma-repository`, `feature-module`, optional `application-port` (realtime)
- Presentation: `presentation-http`, `authorize-kind`
- Sequence: `.cursor/rules/entity-creation-sequence.mdc`

## Etalon

- Master service CUD: `master-services.controller.ts` + create/update/delete use-cases
- Action with side-effects: `appointments` cancel/confirm (+ realtime publisher)

## Steps

1. Domain create/update inputs + policies/errors + write port
2. UC внутри `ITransactionManager.runInTransaction` (read → policy → write → optional port)
3. Prisma write + write-error mapper; entity module `useFactory`
4. Presentation: AJV `*-payload.schema.ts`, `request-body-to-*` / `request-params-to-*`, response mapper, controller
5. Wire modules; map new domain error codes
6. Если side-effect вне БД (WS/SSE/push) — application port + infra adapter (skill `application-port`)

## Rules

- Writes требуют `TransactionScope`; инварианты в domain policies, не в controller
- Update patch: `null` clear / `undefined` leave — mapper/`pick-patch` только defined keys
- Application input: `actor: { userId, isStaffUser }` (или caller) для mutate/get-by-id
- Use-case **не** вызывает другой use-case — оркестрация в controller через `output-*-to-*-use-case-input`
- Не использовать `*Command` — только `I*ApplicationInput`
- Auth обычно `authenticated` или `permissions` — см. `authorize-kind`

## Checklist

- [ ] domain inputs + policies + write port
- [ ] one TX in UC
- [ ] schema + mappers + thin controller
- [ ] error mapper updated
- [ ] modules wired
- [ ] optional realtime/notification port wired
