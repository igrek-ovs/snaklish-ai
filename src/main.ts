import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // Разрешаем отправку cookies / headers
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
