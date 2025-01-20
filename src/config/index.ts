import * as dotenv from 'dotenv';
dotenv.config();

export const APP_ENV = process.env?.APP_ENV ?? 'dev';
export const DB_HOSTNAME = process.env?.DB_HOSTNAME ?? 'localhost';
export const DB_PORT = process.env?.DB_PORT ?? 5432;
export const DB_USERNAME = process.env?.DB_USERNAME ?? 'localhost';
export const DB_PASSWORD = process.env?.DB_PASSWORD ?? 'localhost';
export const DB_DATABASE = process.env?.DB_DATABASE ?? 'supra_kyc_isolation';
