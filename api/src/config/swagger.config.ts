import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('My API') // Название API
    .setDescription('Документация API') // Описание
    .setVersion('1.0') // Версия API
    .addBearerAuth() // Добавляет авторизацию через Bearer токен
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
