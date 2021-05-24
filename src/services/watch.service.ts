import {RecordModel} from '../model/record.model';

export class WatchService {
  static getLastPeriodDivs = (records: RecordModel[]): RecordModel[] => {
    const lastPeriodRecords = [];
    for (const r of records) {
      lastPeriodRecords.push(r);
      if (r.newPeriod) {
        break;
      }
    }
    return lastPeriodRecords;
  };

  static getAverageRate = (records: RecordModel[]) => {
    const lastPeriods = WatchService.getLastPeriodDivs(records);
    const milliPerDay = 3600 * 24 * 1000;
    let lastTime = 0;
    let lastDiv = 0;
    let sumRate = 0;
    let count = 0;
    const rates = [];
    for (const r of lastPeriods) {
      if (lastTime === 0) {
        lastTime = r.timestampOfPhoto;
        lastDiv = r.secondDif;
      } else {
        const rate = (r.secondDif - lastDiv) / ((r.timestampOfPhoto - lastTime) / milliPerDay);
        sumRate += rate;
        rates.push(rate);
        lastTime = r.timestampOfPhoto;
        lastDiv = r.secondDif;
        count++;
      }
    }
    return {avg: sumRate / count, rates: rates};
  };

  static formatRate = (rate: number): string => {
    if (isNaN(rate)) {
      return '-';
    }
    let prefix = '';
    if (rate >= 0) {
      prefix = '+';
    }
    return prefix + rate.toFixed(1);
  };
}
