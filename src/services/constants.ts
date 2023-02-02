import { NetworkMode } from "@tanstack/react-query";

const {
  REACT_APP_GH_TOKEN,
  REACT_APP_GH_REPO_OWNER,
  REACT_APP_GH_REPO_NAME,
  REACT_APP_DEBUG
} = process.env

// Base Url for MSW Mocks
export const RESTURL = "https://api.github.com";
// Enable console.logs
export const PREVIEW = REACT_APP_DEBUG
export const TOKEN = REACT_APP_GH_TOKEN
// Target Github Repo to be fetched
export const REPO = {
  owner: REACT_APP_GH_REPO_OWNER??"recharts", 
  repo: REACT_APP_GH_REPO_NAME??"recharts" 
}

PREVIEW&&console.log('REPO',process.env, REPO)

// Internal Cache interval for GithubService 
export const CACHED_INTERVAL = 5*60*1000
// App-Default networkMode for ReactQuery
export const RQ_NETWORK_MODE:NetworkMode = "always";