import 'module-alias/register';
import express from 'express';
import dotenv from 'dotenv';
import GeminiRouter from '@Routes/Gemini';
import Logger from '@Helpers/Logs/Logger';
import MySQL from '@Configs/Db/MySQL';

dotenv.config();

const app = express();

app.use(express.json());

app.use(GeminiRouter);

const startServer = async () => {
  try {
    await MySQL.connect();
    await MySQL.createTableIfNotExists();
    app.listen(process.env.PORT, () => {
      Logger.info(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    Logger.error('Server failed to start');
    Logger.error(error);
  }
};

startServer();
