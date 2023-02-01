import { rest } from 'msw';
import { RESTURL } from '../../services/constants.ts';
import { formatRepoUrl } from '../../services/utils.ts';
import { jsonReposIssuesOnlyPulls } from './getReposIssues';

const urlIssues = RESTURL+formatRepoUrl('/repos/{owner}/{repo}/issues')
const urlPullDetails = RESTURL+formatRepoUrl('/repos/{owner}/{repo}/pulls/*')

export const handlers = [
  // Handles a GET /user request
  rest.get(
    urlIssues,
    (req, res, ctx) => {

      return res(
        ctx.status(200),
        ctx.json(jsonReposIssuesOnlyPulls),
      )

    }
  ),

  rest.get(
    urlPullDetails,
    (req, res, ctx) => {

      return res(
        ctx.status(200),
        ctx.json(jsonReposIssuesOnlyPulls),
      )

    }
  ),

];
