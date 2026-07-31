---
name: application-port
description: >-
  Scaffolds my-master-api application port + infrastructure adapter (realtime
  publisher, SSE, external side-effect) for a feature. Use when a use-case needs
  an outbound side-effect that is not a repository (WebSocket, SSE, web-push
  helper port), or when adding I*Publisher / similar ports.
---

# Application port (side-effects)

Для outbound side-effects **вне** persistence: realtime push, SSE, адаптеры уведомлений.

Это **не** cross-service RPC gateway (в my-master-api их нет) и **не** outbox.

## Read first

- Etalon port: `src/modules/appointments/application/ports/appointment/i-appointment-realtime.publisher.ts`
- Etalon adapter: `…/infrastructure/web-socket/appointment/socket-io-appointment-realtime.publisher.ts`
- Etalon gateway (presentation): `…/presentation/web-socket/appointment/appointment.gateway.ts`
- Architecture: `.cursor/rules/architecture-ddd-clean.mdc`

## Output

```text
application/ports/<entity>/
  i-<thing>.publisher.ts          # или i-<thing>.port.ts
  <thing>.tokens.ts
  index.ts

infrastructure/web-socket|sse/<entity>/
  <adapter>-<thing>.publisher.ts  # implements port
  *-realtime.event-bus.ts         # если нужен in-process bus

presentation/web-socket/<entity>/   # только если нужен Nest Gateway
  <entity>.gateway.ts
  *-ws.events.ts
```

Bind in entity/feature module:

```ts
{ provide: APPOINTMENT_REALTIME_PUBLISHER_TOKEN, useClass: SocketIoAppointmentRealtimePublisher }
```

Inject TOKEN into UC `useFactory`.

## Rules

- Port живёт в **application/ports** (не в domain entities)
- Adapter в infrastructure; presentation gateway только thin transport
- Use-case зависит от порта, не от Socket.IO / Nest Gateway напрямую
- Domain не импортирует порты application
- Не тащить Prisma / HTTP response shaping в publisher

## Checklist

- [ ] Interface + TOKEN в application/ports
- [ ] Adapter implements port
- [ ] Module binding + UC inject
- [ ] Нет framework types в port-контракте
