import './workers/image.worker';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

async function bootstrap() {
  const app =
    await NestFactory.create(AppModule);

  const config =
    new DocumentBuilder()
      .setTitle(
        'Image Processing API',
      )
      .setDescription(
        'Async image processing using NestJS, BullMQ, Redis, and Sharp',
      )
      .setVersion('1.0')
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );

  await app.listen(3001);

  console.log(
    'Swagger: http://localhost:3001/api',
  );
}

bootstrap();