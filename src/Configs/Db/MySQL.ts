import mysql, { FieldPacket, RowDataPacket } from 'mysql2';
import Logger from '@Helpers/Logs/Logger'

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export class MySQL {

  private _mysql: mysql.Pool;

  constructor() {
    this._mysql = mysql.createPool(config);
  }

  public query(): (sql: string, values?: any[]) => Promise<[RowDataPacket[], FieldPacket[]]> {
    return this._mysql.promise().query.bind(this._mysql.promise());
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

  public async createTableIfNotExists() {
    const query = `
      CREATE TABLE IF NOT EXISTS measurements (
      measure_uuid VARCHAR(36) PRIMARY KEY,
      measure_datetime DATETIME NOT NULL,
      measure_type ENUM('WATER', 'GAS') NOT NULL,
      image_url TEXT NOT NULL,
      measure_value INT NOT NULL,
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

export default new MySQL();
