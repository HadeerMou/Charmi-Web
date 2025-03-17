import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const port = process.env.PORT || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Charmi API')
    .setDescription('The Charmi API description')
    .addServer(`http://localhost:${port}`)
    .addServer('https://api.charmi-eg.com')
    .addServer('https://charmi.awsapprunner.com')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors();

  app.enableShutdownHooks();

  await app.listen(port);
}
bootstrap()
  .then(() =>
    console.log(`Application is running on: http://localhost:${3000}`),
  )
  .catch((error) => console.error('Error during application startup:', error));
