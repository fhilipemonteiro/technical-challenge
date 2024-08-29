import MySQL from '@Configs/MySQL';
import { v4 as uuid } from 'uuid';
import Logger from '@Helpers/Logger';
import FormatDate from '@Helpers/FormatDate';
import { RowDataPacket, FieldPacket } from "mysql2";

interface IGeminiRepository {
  createMeasure(props: ICreateMeasure): Promise<void>;
  checkMeasureExists(customer_code: string, measure_type: string,measure_datetime: string): Promise<boolean>;
}

interface ICreateMeasure {
  measure_uuid: string;
  measure_datetime: string;
  measure_type: string;
  image_url: string;
  measure_value: null;
  customer_code: string;
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
        customer_code
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
      uuid(),
      this.formatDate.formatDateTime(props.measure_datetime),
      props.measure_type,
      props.image_url,
      props.measure_value,
      props.customer_code
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

  public async checkMeasureExists(customer_code: string, measure_type: string,measure_datetime: string): Promise<boolean> {

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

}

export default GeminiRepository;
