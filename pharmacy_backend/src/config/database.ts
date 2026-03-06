import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'pharmacy_inventory';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'pharmacy123';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected Successfully');
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error);
    process.exit(1);
  }
};