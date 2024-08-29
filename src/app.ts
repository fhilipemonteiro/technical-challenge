import 'module-alias/register';
import express from 'express';
import Logger from '@Helpers/Logger';
import Env from '@Helpers/Env';
import MySQL from '@Configs/MySQL';
import GeminiRouter from '@Routes/GeminiRoute';

const app = express();
const mysql = new MySQL();

app.use(express.json());
app.use(GeminiRouter);

const startServer = async () => {
  try {
    await mysql.connect();
    await mysql.createTableIfNotExists();

    app.listen(Env.PORT, () => {
      Logger.info(`Server is running on port ${Env.PORT}`);
    });
  } catch (error) {
    Logger.error('Server failed to start');
    Logger.error(error);
    process.exit(1);
  }
};

startServer();
