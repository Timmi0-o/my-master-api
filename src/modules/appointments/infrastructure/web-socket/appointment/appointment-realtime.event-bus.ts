import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject, type Subscription } from 'rxjs';
import { AppointmentRealtimeEvent } from './i-appointment-realtime.events';

@Injectable()
export class AppointmentRealtimeEventBus implements OnModuleDestroy {
  private readonly events$ = new Subject<AppointmentRealtimeEvent>();

  publish(event: AppointmentRealtimeEvent): void {
    this.events$.next(event);
  }

  subscribe(listener: (event: AppointmentRealtimeEvent) => void): Subscription {
    return this.events$.subscribe(listener);
  }

  onModuleDestroy(): void {
    this.events$.complete();
  }
}
