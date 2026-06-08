import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject, type Subscription } from 'rxjs';
import type { AppointmentChatRealtimeEvent } from './appointment-chat-realtime.events';

@Injectable()
export class AppointmentChatRealtimeEventBus implements OnModuleDestroy {
  private readonly events$ = new Subject<AppointmentChatRealtimeEvent>();

  publish(event: AppointmentChatRealtimeEvent): void {
    this.events$.next(event);
  }

  subscribe(
    listener: (event: AppointmentChatRealtimeEvent) => void,
  ): Subscription {
    return this.events$.subscribe(listener);
  }

  onModuleDestroy(): void {
    this.events$.complete();
  }
}
