import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import type { NotificationRealtimeEvent } from './i-notification-realtime.events';

@Injectable()
export class NotificationSseEventBus implements OnModuleDestroy {
  private readonly events$ = new Subject<NotificationRealtimeEvent>();

  publish(event: NotificationRealtimeEvent): void {
    this.events$.next(event);
  }

  asObservable(): Observable<NotificationRealtimeEvent> {
    return this.events$.asObservable();
  }

  onModuleDestroy(): void {
    this.events$.complete();
  }
}
