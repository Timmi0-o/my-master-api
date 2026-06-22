import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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

  const logger = app.get<ILoggerService>(ILoggerSymbol);

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ResponseInterceptor(),
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
