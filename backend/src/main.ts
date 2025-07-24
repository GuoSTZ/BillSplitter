import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createDatabaseIfNotExists } from './database-setup';

async function bootstrap() {
  // 在应用启动前创建数据库
  try {
    await createDatabaseIfNotExists();
    console.log('数据库检查/创建完成');
  } catch (error) {
    console.error('数据库创建失败，应用启动中止:', error);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  
  // 启用 CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Vite 默认端口
    credentials: true,
  });
  
  // 添加全局验证管道
  app.useGlobalPipes(new ValidationPipe());
  
  // 添加全局前缀
  app.setGlobalPrefix('billApi');
  
  await app.listen(5200);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('Database: billSplitterDB on 120.26.128.141:3306');
}
bootstrap();
