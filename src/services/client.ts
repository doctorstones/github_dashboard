import { Octokit } from "octokit";

const client = new Octokit({ 
  auth: process.env.GH_TOKEN,
});

export default client;