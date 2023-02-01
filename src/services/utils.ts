import { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import { REPO } from "./constants";

export interface Timeseries {
  day: string,
  [other: string]: any
}

const formatRepoUrl = (origin: string): string => {
  return origin
    .replace('{owner}', REPO.owner)
    .replace('{repo}', REPO.repo);
}

const formatDuration = (duration: duration.Duration): string => {
  const Y = duration.years();
  const M = duration.months();
  const D = duration.days();
  const YY = Y ? Y > 1 ? Y + 'years ' : Y + 'year ' : '';
  const MM = M ? M > 1 ? M + 'months ' : M + 'month ' : '';
  const DD = D ? D > 1 ? D + 'days ' : D + 'day ' : '';
  const HM = duration.hours() + 'h' + duration.minutes() + 'm';
  return YY + MM + DD + HM;
}

/**
 * *DEPRECATED* 
 * Helper to create a list of dates between from-to
 * @param fromDate start date (included)
 * @param toDate end date (included)
 * @param valueFormat format (dayjs) - string
 * @param rest other properties to be included in the item
 * @returns an array of objects with dates+rest as values
 */
const createTimeseriesList = (fromDate: Dayjs, toDate: Dayjs, valueFormat?: string, rest?: any): Timeseries[] => {
  const dateArray = [];
  let currentDate = fromDate;
  while (currentDate <= toDate) {
    dateArray.push({ day: valueFormat ? currentDate.format(valueFormat) : currentDate, ...rest });
    currentDate = currentDate.add(1, 'day');
  }
  return dateArray;
}

/**
 * Helper to create an object filled with dates between from-to
 * @param fromDate start date (included)
 * @param toDate end date (included)
 * @param valueFormat format (dayjs) - string
 * @param rest other properties to be included in the resulting value
 * @returns an object with dates as keys and dates+rest as values
 */
const createTimeseriesKeys = (fromDate: Dayjs, toDate: Dayjs, valueFormat: string, rest?: any): { [day: string]: Timeseries } => {
  let dateKeys: any = {};
  let currentDate = fromDate;
  while (currentDate <= toDate) {
    const keyname = currentDate.format(valueFormat)
    dateKeys[keyname] = { day: currentDate.format(valueFormat), ...rest }
    currentDate = currentDate.add(1, 'day');
  }
  return dateKeys;
}

export {
  createTimeseriesKeys,
  createTimeseriesList,
  formatDuration,
  formatRepoUrl,

}