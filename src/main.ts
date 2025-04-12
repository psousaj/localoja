import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    // store
  }))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
