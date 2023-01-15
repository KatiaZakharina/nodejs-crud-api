import 'dotenv/config';

export default {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  host: process.env.HOST || 'localhost',
};