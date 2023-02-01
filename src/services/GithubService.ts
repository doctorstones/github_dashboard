import { QueryFunctionContext } from "@tanstack/react-query";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import client from "./client";
import { PREVIEW, REPO } from "./constants";
import { createTimeseriesKeys, formatDuration, formatRepoUrl } from "./utils";

dayjs.extend(duration);

type IssuesType='issues'|'pulls'

/**
 * Service-middleware for handling/parsing data from Github REST
 * Reference URL: https://docs.github.com/en/rest?apiVersion=2022-11-28
 * 
 * * IMPORTANT NOTE FOR THE REVIEWER
 * 
 * I've tried to limit calls and reuse, whenever possible, data coming from first call only (getAllIssues).
 * 
 * As you know, GH Rest API for pulls returns additions+deletions data
 * from on GET pull_number requests (and deeper), not from LIST requests.
 * 
 * Since Rest API have rate limits and I'm moving in a
 * simplified test/example approach, I've decided to use as SoT
 * a subset of results in front of the whole data that can come from 
 * an huge Repo. 
 * 
 * This will lead to imperfect result in terms of precision (average is falsed from partial data)
 * but most likely will avoid to have a 403 status when fetching data for repo with a lot of activities;
 * 
 * Apologize but I didnt find a better approach to handle this issue given the scope/documentation/time I had
 */

const LIMIT_TO_LATEST = 20;

const GithubService = {

  fetchAllIssues: async (type: IssuesType = 'issues') => {

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

      const filteredResult = result
        .filter(
          (itm: any) => type === 'pulls' ?
            itm.hasOwnProperty('pull_request') :
            !itm.hasOwnProperty('pull_request')
        )

      if (!filteredResult.length)
        throw new Error('Empty Data')

      return filteredResult;

    } catch (error) {
      throw new Error(String(error))
    }
  },

  fetchPullsDetail: async () => {

    try {

      let COUNTER = 0;
      
      const result = await GithubService.fetchAllIssues("pulls");
      const resultToFetch = result.map(async (itm: any) => {
        COUNTER++
        if (itm.state === "closed" && COUNTER < LIMIT_TO_LATEST) {
          const pullDetail = await client.rest.pulls.get(
            {
              ...REPO,
              pull_number: itm.number
            }
          )
          // console.log('pullDetail', pullDetail);
          if (pullDetail.status === 200 && pullDetail.data) return pullDetail.data
          return false;
        }
      })

      const detailedResult = await Promise.all(resultToFetch.filter((itm)=>!false));
      console.log('detailedResult',detailedResult); 
      return detailedResult;

    } catch (error) {

      throw new Error(String(error))

    }
  },


  /**
   * Given a list of fetched pulls, 
   * parses results to return an Array of data objects ready for Rechart-BarGraph
   * @param context 
   * @returns 
   */
  getPullsAverageSize: async (context?: QueryFunctionContext) => {
    try {

      const result = await GithubService.fetchPullsDetail()

      const sizes = [
        { name: 'Small', range: [0, 100], pulls: 0, ms:0, duration: 0 },
        { name: 'Medium', range: [101, 1000], pulls: 0, ms:0, duration: 0 },
        { name: 'Large', range: [1001, Infinity], pulls: 0, ms:0, duration: 0 }
      ]

      result.forEach((itm: any) => {

        const changes = itm.additions + itm.deletions;
        sizes.forEach((size) => {
          if (changes > size.range[0] && changes < size.range[1]) {
            size.pulls++;
            size.ms += dayjs(itm.closed_at).diff(itm.created_at)
            size.duration = dayjs.duration(size.ms).asHours()
          }
        })

      })

      return sizes;

    } catch (error) {
      throw new Error(String(error))
    }
  },

  /**
   * Fetches a list of pulls (only closed) and parses the averageTime to be closed
   * @param context ReactQuery context (queryKey, params...)
   * @returns formatted string of averageTime
   */
  getPullsMergeTime: async (context?: QueryFunctionContext) => {

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

  getIssuesAverageCloseTime: async (context?: QueryFunctionContext) => {

    try {

      const issues = await GithubService.fetchAllIssues()

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

  getIssuesForPeriod: async (context: QueryFunctionContext) => {

    const [_key] = context.queryKey;

    try {

      const result = await GithubService.fetchAllIssues(_key as IssuesType)

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