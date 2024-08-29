import mysql, { FieldPacket, RowDataPacket } from 'mysql2';
import Logger from '@Helpers/Logger'
import Env from '@Helpers/Env';

const config = {
  host: Env.DB_HOST,
  user: Env.DB_USER,
  password: Env.DB_PASSWORD,
  database: Env.DB_NAME,
};

interface IMySQL {
  connect: () => Promise<void>;
  query: () => (sql: string, values?: any[]) => Promise<[RowDataPacket[], FieldPacket[]]>;
  createTableIfNotExists: () => Promise<void>;
}

class MySQL implements IMySQL {

  private _mysql: mysql.Pool;

  constructor() {
    this._mysql = mysql.createPool(config);
  }

  public async connect() {
    try {
      await this._mysql.promise().getConnection();
      Logger.info('Database connected');
    } catch (error) {
      Logger.error('Database connection failed');
      Logger.error(error);
    }
  }

  public query(): (sql: string, values?: any[]) => Promise<[RowDataPacket[], FieldPacket[]]> {
    return this._mysql.promise().query.bind(this._mysql.promise());
  }

  public async createTableIfNotExists() {
    const query = `
      CREATE TABLE IF NOT EXISTS measurements (
      measure_uuid VARCHAR(36) PRIMARY KEY,
      measure_datetime DATETIME NOT NULL,
      measure_type ENUM('WATER', 'GAS') NOT NULL,
      image_url TEXT NOT NULL,
      measure_value INT NULL,
      customer_code VARCHAR(255) NOT NULL,
      has_confirmed BOOLEAN DEFAULT false)
    `;

    try {
      await this._mysql.promise().query(query);
      Logger.info('Table created');
    } catch (error) {
      Logger.error('Table creation failed');
      Logger.error(error);
    }
  }
}

export default MySQL;