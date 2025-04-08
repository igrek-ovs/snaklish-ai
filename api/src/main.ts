import { webcrypto } from 'crypto';
// (global as any).crypto = webcrypto;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  const options = new DocumentBuilder()
    .setTitle('My API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT', // необязательно, просто для информации
      name: 'Authorization',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  // Expose the Swagger JSON at /swagger-json
  app.getHttpAdapter().get('/swagger-json', (_, res) => res.json(document));

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:4200'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
