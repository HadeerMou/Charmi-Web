import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
/* import helmet from 'helmet'; // ← extra security headers
 */ import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const port = process.env.PORT || 3000;

  /*   // security
  app.use(helmet()); */

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const modelDir =
    process.env.MODEL_STORAGE_PATH ||
    join(__dirname, '..', 'public', 'products');
  app.use('/products', express.static(modelDir));

  const config = new DocumentBuilder()
    .setTitle('Charmi API')
    .setDescription('The Charmi API description')
    .addServer('https://api.charmi.shop')
    .addServer(`http://localhost:${port}`)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors({
    origin: [
      'https://charmi-web.vercel.app', // production frontend on Vercel
      'https://charmi.shop', // root domain if you serve frontend here
      'https://www.charmi.shop',
      'http://localhost:3001', // local dev
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.enableShutdownHooks();

  await app.listen(port);
}
bootstrap()
  .then(() =>
    console.log(`Application is running on: http://localhost:${3000}`),
  )
  .catch((error) => console.error('Error during application startup:', error));
