---
name: authorize-kind
description: >-
  Chooses my-master-api HTTP auth + @Authorize kind (authenticated | staff-only |
  permissions) and related guards/decorators. Use when picking or changing access
  for a presentation HTTP endpoint.
---

# Authorize kind

Авторизация двухуровневая:

1. Guards: `@PublicEndpoint()` **или** `@UseGuards(JwtAuthGuard)` / `JwtAuthGuard + AuthorizeGuard`
2. `@Authorize({ kind, permissions? })` → mirrors `TAuthorizeOptions` in `authorization/domain/auth`

## Read first

- Domain: `src/modules/authorization/domain/auth/authorize-options.ts`
- Permissions catalog: `authorization/domain/permissions/permission-names.ts`
- Architecture RBAC section: `.cursor/rules/architecture-ddd-clean.mdc`
- Rule: `.cursor/rules/domain-auth.mdc`
- Etalon: `masters/.../master-services.controller.ts`, `authorization` management controllers

## Typical pairs

| Operation | Guards | `@Authorize` |
|---|---|---|
| Authenticated CRUD / me | `JwtAuthGuard, AuthorizeGuard` | `{ kind: 'authenticated' }` |
| Staff-only admin | `JwtAuthGuard, AuthorizeGuard` | `{ kind: 'staff-only' }` |
| Permission-gated | `JwtAuthGuard, AuthorizeGuard` | `{ kind: 'permissions', permissions: [Permissions.*.…] }` |
| Public read/register | `@PublicEndpoint()` | без `@Authorize` |

Kinds: `authenticated` | `staff-only` | `permissions`.

## Rules

- Permissions — только из `Permissions.*`, не magic strings
- `permissions` — OR-семантика; `SUPER_ADMIN` bypass
- `@AuthorizedCaller()` / `@AuthenticatedUser()` когда handler/mapper нужны actor/caller
- Domain access policies (`ensure*Accessible`) — **внутри UC**, не вместо `@Authorize`
- `isStaffUser` в metadata deprecated — предпочитать `@Authorize` + policies
- Empty `permissions` array → deny (как `hasAnyPermission`)

## Checklist

- [ ] Correct guards + `@Authorize` kind
- [ ] Permissions from catalog
- [ ] Actor/caller passed into application input via request mapper
- [ ] Business invariants not stuffed into authorize
