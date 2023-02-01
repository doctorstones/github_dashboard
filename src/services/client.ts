import { Octokit } from "octokit";
import { TOKEN } from "./constants";

const client = new Octokit({ 
  auth: TOKEN,
});

export default client;