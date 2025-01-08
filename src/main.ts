import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validationError: { target: false },
    }),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API SPK AHP')
    .setDescription('Dokumentasi API SPK AHP')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.use('/', (req: Request, res: Response) => {
    res.redirect('/api-docs');
  });

  await app.listen(4040);

  console.log(`Application is running on: http://localhost:4040`);
}
bootstrap();
