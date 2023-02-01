import { QueryFunctionContext } from "@tanstack/react-query";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import client from "./client";
import { PREVIEW, REPO } from "./constants";
import { createTimeseriesKeys, formatDuration, formatRepoUrl } from "./utils";

dayjs.extend(duration);

/**
 * Reference URL: https://docs.github.com/en/rest?apiVersion=2022-11-28
 */
const GithubService = {

  /**
   * Fetches a list of pulls (only closed) and parses the averageTime to be closed
   * @param context ReactQuery context (queryKey, params...)
   * @returns formatted string of averageTime
   */
  getAveragePRMergeTime: async (context?: QueryFunctionContext) => {

    try {

      const result = await client.rest.pulls.list(
        {
          ...REPO,
          state: "closed",
          direction: "desc",
          per_page: 100
        }
      )

      if (result.status !== 200)
        throw new Error('Status ' + result.status) // TODO handle errors;

      if (!result.data.length)
        throw new Error('Empty Data')

      const durations = result.data
        .filter(itm => itm.merged_at)
        .map((itm) => dayjs(itm.merged_at).diff(itm.created_at))
      const average = durations.reduce((a, b) => a + b) / durations.length;
      const averagePRMergeTime = dayjs.duration(average);

      return formatDuration(averagePRMergeTime)

    } catch (error) {

      throw new Error('Parsing Failed: ' + String(error))

    }
  },

  getAllPulls: async () => {
    try {

      const result = await client.paginate(
        formatRepoUrl("GET /repos/{owner}/{repo}/pulls"),
        {
          ...REPO,
          state: "closed",
          direction: "desc",
          per_page: 100,
        }
      )
      return result;
    } catch (error) {
      return [];
    }
  },

  getAllIssues: async (filter?: 'issues' | 'pulls') => {

    try {

      const result = await client.paginate(
        formatRepoUrl("GET /repos/{owner}/{repo}/issues"),
        {
          ...REPO,
          state: "all",
          direction: "desc",
          per_page: 100
        }
      )

      const issues = result
        .filter((itm: any) => !itm.hasOwnProperty('pull_request'))

      const pulls = result
        .filter((itm: any) => itm.hasOwnProperty('pull_request'))

      PREVIEW && console.log('res', result.length, 'iss', issues.length, 'pulls', pulls);

      return filter === 'pulls' ? pulls : issues;
    } catch (error) {
      return [];
    }
  },

  getIssuesAverageCloseTime: async (context?: QueryFunctionContext) => {

    try {

      const issues = await GithubService.getAllIssues()

      if (!issues.length)
        throw new Error('Empty Data')

      const durations = issues
        .filter((itm: any) => itm.state === 'closed')
        .map((itm: any) => dayjs(itm.closed_at).diff(itm.created_at))
      const average = durations.reduce((a, b) => a + b) / durations.length;

      return formatDuration(dayjs.duration(average))

    } catch (error) {

      throw new Error(String(error))

    }
  },

  getIssuesForPeriod: async (context?: QueryFunctionContext) => {

    PREVIEW && console.log(context?.pageParam)

    try {

      const result = await GithubService.getAllIssues()

      if (!result.length)
        throw new Error('Empty Data')

      const dateFormat = 'YYYY-MM-DD';
      const fromDate = dayjs().subtract(1, 'month')
      const toDate = dayjs()
      const period = createTimeseriesKeys(fromDate, toDate, dateFormat, { opened: 0, closed: 0 })

      const issues = result
        .filter((itm: any) =>
          (dayjs(itm.created_at).isAfter(fromDate) || dayjs(itm.closed_at).isAfter(fromDate))
          && (dayjs(itm.created_at).isBefore(toDate) || dayjs(itm.closed_at).isBefore(toDate))
        )

      issues.forEach((itm: any) => {
        const opened = dayjs(itm.created_at).isValid() ? dayjs(itm.created_at).format(dateFormat) : null;
        const closed = dayjs(itm.closed_at).isValid() ? dayjs(itm.closed_at).format(dateFormat) : null;
        if (opened != null && Object(period).hasOwnProperty(opened)) period[opened].opened++;
        if (closed != null && Object(period).hasOwnProperty(closed)) period[closed].closed++;
      })

      PREVIEW && console.log('issues', issues.length, period);

      return {
        count: issues.length,
        graphData: Object.entries(period).map(([name, obj]) => ({ name, ...obj }))
      }

    } catch (error) {

      throw new Error(String(error))

    }
  },

}

export default GithubService;