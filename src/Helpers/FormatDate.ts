import moment from 'moment';

interface IFormatDate {
  formatDateTime: (date: string) => string;
  getMonth: (date: string) => string;
  getYear: (date: string) => string;
}

class FormatDate implements IFormatDate {
  public formatDateTime(date: string): string {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

  public getMonth(date: string): string {
    return moment(date).format('MM');
  }

  public getYear(date: string): string {
    return moment(date).format('YYYY');
  }
}

export default FormatDate;