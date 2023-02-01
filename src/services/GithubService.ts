import { QueryFunctionContext } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import client from "./client";
import { CACHED_INTERVAL, REPO } from "./constants";
import { createTimeseriesKeys, formatDuration, formatRepoUrl } from "./utils";

dayjs.extend(duration);

type IssuesType = 'issues' | 'pulls'

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

const LIMIT_TO_LATEST = 10; // TODO handle better

const GithubService = {

  _cache: {} as { [K: string]: { lastFetch: Dayjs, data: any } },

  setCache: (key: string, data: any[]) => {
    GithubService._cache[key] = { lastFetch: dayjs(), data };
  },

  getCache: (key: string) => {
    if (GithubService._cache.hasOwnProperty(key)) {
      if (GithubService._cache[key].lastFetch.diff() < CACHED_INTERVAL)
        return GithubService._cache[key].data
    }
    return false;
  },

  fetchAllIssues: async (type: IssuesType = 'issues', forceRefresh: boolean = false) => {

    try {

      let result;
      if (forceRefresh || !GithubService.getCache('allIssues')) {

        result = await client.paginate(
          formatRepoUrl("GET /repos/{owner}/{repo}/issues"),
          {
            ...REPO,
            state: "all",
            direction: "desc",
            per_page: 100
          }
        )
        GithubService.setCache('allIssues', result);
      } else {
        result = GithubService.getCache('allIssues');
      }

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
          return pullDetail.data
        }
        return false;

      })

      let detailedResult;
      if (!GithubService.getCache('pullsDetail')) {
        detailedResult = await Promise.all(resultToFetch);
        detailedResult = detailedResult.filter((itm:any) => itm!==false )
        GithubService.setCache('pullsDetail', detailedResult);
      } else {
        detailedResult = GithubService.getCache('pullsDetail')
      }
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
  getPullsBySize: async (context?: QueryFunctionContext) => {
    try {

      const result = await GithubService.fetchPullsDetail()

      const sizes = [
        { name: 'Small', range: [0, 100], pulls: 0, ms: 0, duration: 0 },
        { name: 'Medium', range: [101, 1000], pulls: 0, ms: 0, duration: 0 },
        { name: 'Large', range: [1001, Infinity], pulls: 0, ms: 0, duration: 0 }
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
  getPullsAverageMergeTime: async (context?: QueryFunctionContext) => {

    try {

      const result = await GithubService.fetchAllIssues('pulls')
      
      const durations = result
        .filter((itm: any) => itm.pull_request.merged_at)
        .map((itm:any) => dayjs(itm.pull_request.merged_at).diff(itm.created_at))
      const average = durations.reduce((a:number, b:number) => a + b) / durations.length;
      const averagePRMergeTime = dayjs.duration(average);

      return formatDuration(averagePRMergeTime)

    } catch (error) {

      throw new Error(String(error))

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
      const average = durations.reduce((a:number, b:number) => a + b) / durations.length;

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