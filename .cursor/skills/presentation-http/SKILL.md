---
name: presentation-http
description: >-
  Builds my-master-api presentation HTTP layer (thin controller, AJV schema,
  request mapper, response mapper, error filter). Use when adding or changing
  HTTP handlers, schemas, request-mappers, or http-responses under a feature
  presentation/http.
---

# Presentation HTTP

## Read first

- Etalon CRUD: `src/modules/masters/presentation/http/controllers/master-services.controller.ts`
- Rules: `.cursor/rules/presentation*.mdc`, `http-request-mappers.mdc`, `controllers-no-repositories.mdc`
- Authorize: skill `authorize-kind`
- Naming: request → `request-mappers/` (`request-body-to-*`…); response → `http-responses/`

## Output

```text
presentation/http/controllers/<entities>.controller.ts
presentation/http/validation/schemas/<verb>-<entity>-payload.schema.ts (+ .types.ts)
presentation/http/request-mappers/<entity>/request-*-to-*-use-case-input.ts
presentation/http/http-responses/map-*-response.ts
```

Register controller on feature facade module. Map new domain error codes in shared domain-error mappers if needed.

## Handler template

```ts
@Post()
@Authorize({ kind: 'authenticated' })
async create(
  @HttpBody(createMasterServicePayloadSchema) body: ICreateMasterServicePayload,
  @AuthenticatedUser() user: IAuthenticatedUser,
): Promise<{ data: … }> {
  const input = requestBodyToCreateMasterServiceUseCaseInput(body, user);
  const output = await this.createUseCase.execute(input);
  return mapCreateMasterServiceHttpResponse(output);
}
```

List:

```ts
@Get()
@HttpQuery(listSchema, { preprocess: normalizeListQueryRaw })
→ requestQueryParamsToFindManyParams(…) → getManyUseCase.execute → mapGet*Response
```

## Rules

- Thin only — no Prisma / repos / domain policies
- Inject **only** application use-cases
- Flow: AJV decorator → request mapper → `execute` → response mapper
- Presets/sortable: presentation mappers + domain `*_SELECT_FIELDS` (SoT)
- Mutate schemas: `create-*-payload.schema.ts`, не `*-body.schema.ts`
- Orchestration нескольких UC: `output-*-to-*-use-case-input.ts` в request-mappers
- Errors: `DomainExceptionFilter` + domain-error mappers (не map внутри UC)

## Checklist

- [ ] Schema + request mapper + response mapper
- [ ] Correct guards + `@Authorize`
- [ ] Controller on feature module
- [ ] Naming strict (`request-body-to-*` / `request-query-params-to-*` / `request-params-to-*`)
- [ ] New domain codes mapped if needed
