import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // Путь к сущностям (entity)
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  // Путь к миграциям
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  // Отключаем синхронизацию, чтобы управлять изменениями через миграции
  synchronize: false,
});
