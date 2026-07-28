import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import {
  ILoggerSymbol,
  type ILoggerService,
} from './modules/shared/domain/services/i-logger.service';
import { LoggingInterceptor } from './modules/shared/infrastructure/interceptors/logging.interceptor';
import { ResponseInterceptor } from './modules/shared/infrastructure/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4441',
      'http://localhost:3001',
      'http://tima53419.fvds.ru:3000',
      'http://tima53419.fvds.ru:4441',
      'http://tima53419.fvds.ru',
      'https://tima53419.fvds.ru',
      'http://my-crazy-master.ru',
      'https://my-crazy-master.ru',
      'http://ru.my-crazy-master.ru',
      'https://ru.my-crazy-master.ru',
      'http://en.my-crazy-master.ru',
      'https://en.my-crazy-master.ru',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const logger = app.get<ILoggerService>(ILoggerSymbol);
  const reflector = app.get(Reflector);

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ResponseInterceptor(reflector),
  );

  const PORT = Number(process.env.APP_PORT);
  const defaultPort = 8567;

  await app.listen(PORT || defaultPort, () => {
    Logger.log(
      `Server is running on PORT ${PORT || `fallback to ${defaultPort}`}`,
    );
  });
}

void bootstrap();
