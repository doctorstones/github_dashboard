import { NetworkMode } from "@tanstack/react-query";

const {
  GH_TOKEN,
  GH_REPO_OWNER,
  GH_REPO_NAME,
  DEBUG
} = process.env

// Base Url for MSW Mocks
export const RESTURL = "https://api.github.com";
// Enable console.logs
export const PREVIEW = DEBUG
export const TOKEN = GH_TOKEN
// Target Github Repo to be fetched
export const REPO = {
  
  // owner: "doctorstones", 
  // repo: "ga-test" 

  owner: GH_REPO_OWNER??"recharts", 
  repo: GH_REPO_NAME??"recharts" 
  
}
// Internal Cache interval for GithubService 
export const CACHED_INTERVAL = 5*60*1000
// App-Default networkMode for ReactQuery
export const RQ_NETWORK_MODE:NetworkMode = "always";