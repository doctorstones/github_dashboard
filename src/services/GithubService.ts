import { QueryFunctionContext } from "@tanstack/react-query";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import client from "./client";

dayjs.extend(duration);

// TODO MOVE THIS
const repo = {
  owner: "serratus",
  repo: "quaggaJS"
}

const GithubService = {

  // test: async () => {
  //   try {
  //     const hello = await client.rest.repos.getCommitActivityStats(
  //       repo
  //     )
  //     return hello;
  //   } catch (error) {

  //   }
  // },

  // issues: async function name() {

  // },

  // pulls: async () => {
  //   const result = await client.rest.pulls.list(
  //     {
  //       ...repo,
  //       state: "closed",
  //       direction: "desc",
  //       per_page: 100
  //     }
  //   )

  //   console.log(result);
  //   return result;

  // },

  /**
   * 
   * @param context ReactQuery context (queryKey, params...)
   * @returns formatted string of averageTime
   */
  fetchAveragePRMergeTime: async (context?: QueryFunctionContext) => {

    try {

      const result = await client.rest.pulls.list(
        {
          ...repo,
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

  fetchAverageIssueCloseTime: async (context?: QueryFunctionContext) => {

    try {

      const result = await client.rest.pulls.list(
        {
          ...repo,
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

}

// TODO refactor in utils file;
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

export default GithubService;