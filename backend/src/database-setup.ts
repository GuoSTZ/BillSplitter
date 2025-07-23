import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\``);
    console.log(`数据库 ${process.env.DB_DATABASE} 创建成功或已存在`);
  } catch (error) {
    console.error('创建数据库失败:', error);
    throw error;
  } finally {
    await connection.end();
  }
}