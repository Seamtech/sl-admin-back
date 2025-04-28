import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const port = Number(process.env.PORT) || 3000;
const env = process.env.NODE_ENV;
const host = process.env.HOST || 'localhost';

const start = async () => {
  try {
    const address = await app.listen({ port: port, host: host });
    console.log(`Server running in ${env} at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
