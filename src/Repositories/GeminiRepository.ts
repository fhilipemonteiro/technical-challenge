import { RowDataPacket, FieldPacket, ResultSetHeader } from "mysql2";
import MySQL from '@Configs/MySQL';
import Logger from '@Helpers/Logger';
import FormatDate from '@Helpers/FormatDate';

interface IGeminiRepository {
  createMeasure(props: ICreateMeasure): Promise<void>;
  checkExistsMeasureOfThePeriod(customer_code: string, measure_type: string,measure_datetime: string): Promise<boolean>;
  checkExistsMeasure(measure_uuid: string): Promise<boolean>;
  checkMeasurementIsAlreadyConfirmed(measure_uuid: string): Promise<boolean>;
  confirmMeasure(measure_uuid: string, measure_value: number): Promise<boolean>;
  getMeasures(customer_code: string, measure_type: string): Promise<returnListMeasures[] | []>;
}

interface ICreateMeasure {
  measure_uuid: string;
  measure_datetime: string;
  measure_type: string;
  measure_value: number;
  image_url: string;
  customer_code: string;
}

interface returnListMeasures {
  measure_uuid: string;
  measure_datetime: string;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
}

class GeminiRepository implements IGeminiRepository {

  private db: MySQL;
  private formatDate: FormatDate;

  constructor() {
    this.db = new MySQL();
    this.formatDate = new FormatDate();
  }

  public async createMeasure(props: ICreateMeasure): Promise<void> {
    const query = `
      INSERT INTO measurements (
        measure_uuid,
        measure_datetime,
        measure_type,
        image_url,
        measure_value,
        customer_code,
        has_confirmed
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
      props.measure_uuid,
      this.formatDate.formatDateTime(props.measure_datetime),
      props.measure_type,
      props.image_url,
      props.measure_value,
      props.customer_code,
      false
    ];
  
    try {
      await this.db.query()(query, values);
      Logger.info('Measurement created');
    } catch (error) {
      Logger.error('Measurement creation failed');
      Logger.error(error);
      throw error;
    }
  }

  public async checkExistsMeasureOfThePeriod(customer_code: string, measure_type: string,measure_datetime: string): Promise<boolean> {
    const month = this.formatDate.getMonth(measure_datetime);
    const year = this.formatDate.getYear(measure_datetime);

    const query = `
      SELECT COUNT(*) AS count
      FROM measurements
      WHERE customer_code = ?
      AND measure_type = ?
      AND MONTH(measure_datetime) = ?
      AND YEAR(measure_datetime) = ?
    `;
  
    const values = [customer_code, measure_type, month, year];
  
    try {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await this.db.query()(query, values);
      const count = rows[0].count as number;
      return count > 0;
    } catch (error) {
      Logger.error('Error checking if measure exists');
      Logger.error(error);
      throw error;
    }
  }

  public async checkExistsMeasure(measure_uuid: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) AS count
      FROM measurements
      WHERE measure_uuid = ?
    `;
  
    const values = [measure_uuid];
  
    try {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await this.db.query()(query, values);
      const count = rows[0].count as number;
      return count > 0;
    } catch (error) {
      Logger.error('Error checking if measure exists');
      Logger.error(error);
      throw error;
    }
  }

  public async checkMeasurementIsAlreadyConfirmed(measure_uuid: string): Promise<boolean> {
    const query = `
      SELECT has_confirmed
      FROM measurements
      WHERE measure_uuid = ?
    `;
  
    const values = [measure_uuid];
  
    try {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await this.db.query()(query, values);
      const has_confirmed = rows[0].has_confirmed as boolean;
      return has_confirmed;
    } catch (error) {
      Logger.error('Error checking if measure is already confirmed');
      Logger.error(error);
      throw error;
    }
  }

  public async confirmMeasure(measure_uuid: string, measure_value: number): Promise<boolean> {
    const query = `
      UPDATE measurements
      SET measure_value = ?,
      has_confirmed = ?
      WHERE measure_uuid = ?
    `;
  
    const values = [measure_value, true, measure_uuid];
  
    try {
      const [rows]: [ResultSetHeader, FieldPacket[]] = await this.db.query()(query, values);
      const affectedRows = rows.affectedRows as number;
      return affectedRows > 0;
    } catch (error) {
      Logger.error('Measurement confirmation failed');
      Logger.error(error);
      throw error;
    }
  }

  public async getMeasures(customer_code: string, measure_type: string): Promise<returnListMeasures[] | []> {
    const query = `
      SELECT measure_uuid, measure_datetime, measure_type, has_confirmed, image_url
      FROM measurements
      WHERE customer_code = ?
      ${measure_type ? 'AND measure_type = LOWER(?)' : ''}
    `;
  
    const values = measure_type ? [customer_code, measure_type] : [customer_code];
  
    try {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await this.db.query()(query, values);

      if (!rows.length) {
        return [];
      }

      const processedRows = rows.map(row => ({
        ...row,
        has_confirmed: !!row.has_confirmed,
      })) as returnListMeasures[];
      
      return processedRows;
    } catch (error) {
      Logger.error('Error listing measures');
      Logger.error(error);
      throw error;
    }
  }
}

export default GeminiRepository;
