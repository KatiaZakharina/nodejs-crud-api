import 'dotenv/config';

export default {
  port: parseInt(process.env.PORT, 10) || 4000,
  host: process.env.HOST || 'localhost',
};