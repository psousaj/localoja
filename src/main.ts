import { NestFactory } from '@nestjs/core';
import { TypeormStore } from 'typeorm-store';
import * as session from 'express-session';

import { AppModule } from './app.module';
import { SessionEntity } from './domain/auth/session.entity'
import { EnvService } from './config/env/env.service'
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const env = app.get(EnvService);

  app.enableCors({
    origin: env.get('CORS_ORIGIN'),
    credentials: true,
  });

  app.use(
    session({
      secret: env.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
      store: new TypeormStore({
        ttl: 1000 * 60 * 60 * 24, // 24 hours
        repository: dataSource.getRepository(SessionEntity),
      })
    })
  )

  await app.listen(env.get('PORT'), '0.0.0.0');
}

bootstrap();
