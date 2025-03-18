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

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Charmi API')
    .setDescription('The Charmi API description')
    .addServer(`http://localhost:${port}`)
    .addServer('https://charmi-web-production.up.railway.app')
    .addServer('https://api.charmi-eg.com') // Modify as needed
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Configure CORS properly
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://charmi-web-production.up.railway.app',
    ],
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) =>
  console.error('Error during application startup:', error),
);
