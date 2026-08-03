import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { loadRedisConfig, type IRedisConfig } from './redis.config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly config: IRedisConfig;
  private client!: Redis;

  constructor() {
    this.config = loadRedisConfig();
  }

  onModuleInit(): void {
    this.client = this.createClient('app');
    this.client.on('connect', () => {
      this.logger.log(
        `Redis connected (${this.config.host}:${this.config.port})`,
      );
    });
    this.client.on('error', (error: Error) => {
      this.logger.error(`Redis error: ${error.message}`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.client) {
      return;
    }
    await this.client.quit().catch(() => this.client.disconnect());
  }

  getClient(): Redis {
    return this.client;
  }

  /** Dedicated connection for Socket.IO / Bull pub-sub (must not share command queue). */
  createClient(label: string): Redis {
    const client = new Redis(this.config.url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      lazyConnect: false,
    });
    client.on('error', (error: Error) => {
      this.logger.error(`Redis[${label}] error: ${error.message}`);
    });
    return client;
  }

  getConfig(): IRedisConfig {
    return this.config;
  }
}
