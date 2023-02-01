import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { createTimeseriesKeys, formatDuration, Timeseries } from "../../services/utils"

dayjs.extend(duration);

describe('utils.ts', () => {

  it('formatDuration', () => {
    const result_MIN = formatDuration(dayjs.duration(1000000));
    expect(result_MIN).toBe('0h16m')

    const result_YEAR = formatDuration(dayjs.duration(900000000));
    expect(result_YEAR).toBe('10days 10h0m')
  })

  it('createTimeseriesKeys', () => {

    const expected = {
      '2022-01-01': { day: '2022-01-01' },
      '2022-01-02': { day: '2022-01-02' }
    }
    const result = createTimeseriesKeys(dayjs('2022-01-01'), dayjs('2022-01-02'), 'YYYY-MM-DD')

    expect(result).toBeDefined()
    expect(result).toMatchObject<{ [day: string]: Timeseries }>(expected)

  })

})