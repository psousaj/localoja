import { NestFactory } from '@nestjs/core';
import { TypeormStore } from 'typeorm-store';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { SessionEntity } from './domain/auth/session.entity'
import { EnvService } from './config/env/env.service'
import { Logger, ValidationPipe } from '@nestjs/common';
import { DB_TAG } from './config/const';
import { bootstrapLogger } from './config/bootstrapLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const dataSource = app.get(DB_TAG);
  const env = app.get(EnvService);

  // Logger
  // const appLogger = app.get(AppLogger);
  // app.useLogger(appLogger); // Nest built-in logs

  // Show startup info
  // bootstrapLogger(appLogger, env.get("NODE_ENV"));
  // Cors
  app.enableCors({
    origin: env.get('CORS_ORIGIN').split(',').map(o => o.trim()),
    credentials: true,
  });

  app.setGlobalPrefix('api/v2');

  // Sessions
  app.use(
    session({
      secret: env.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      store: new TypeormStore({
        ttl: 1000 * 60 * 60 * 24,
        repository: dataSource.getRepository(SessionEntity),
      }),
    }),
  );

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Transforma o body em DTO
    errorHttpStatusCode: 422,
    skipMissingProperties: false,
    whitelist: true,             // Remove props que não estão no DTO
    forbidNonWhitelisted: true, // Dá erro se mandar prop que não existe
  }));

  await app.listen(env.get('PORT'), '0.0.0.0');
  bootstrapLogger(new Logger(), env.get("NODE_ENV"));
}

bootstrap();