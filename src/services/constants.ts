import { NetworkMode } from "@tanstack/react-query";

export const RESTURL = "https://api.github.com";
export const PREVIEW = process.env.PREVIEW
export const REPO = {
  // owner: "doctorstones", 
  // repo: "ga-test" 
  owner: "recharts", 
  repo: "recharts" 
}
export const CACHED_INTERVAL = 5*60*1000
export const RQ_NETWORK_MODE:NetworkMode = "always";