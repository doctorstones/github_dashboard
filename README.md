# Daniele Massi - Liferay Front-end Test

## Install Project

1. Download and unzip the file in a folder
2. From shell, go in that folder and type
   `yarn` (or `npm i --force`).

## Run Project

Project can be run in develop or built.

1. To run in develop, type from shell `yarn start` (or `npm run start`)
1. To build, type from shell `yarn build`
1. To run the build, type from shell `serve -s build`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Basic Configuration

To be run properly, project needs some environment variables.
In the root folder, create a new file `.env` and paste this **before building**:

```
DEBUG=true
GH_TOKEN=[Your personal Token on Github]
GH_REPO_OWNER=recharts <- Repo owner
GH_REPO_NAME=recharts <- Repo name
```


\*\*
For example, If you want to address dashboard data to https://github.com/doctorstones/ga-test, change variables to

```
GH_REPO_OWNER=doctorstones
GH_REPO_NAME=ga-test
```
Please note that the repo I've used as example (recharts) will require about 20secs to load data, because it contains a lot of issues/PR.


### Some info on approach I've followed

*for data*
- I never used before GithubRest API, so probably my lack of knowledge could had lead to some issue
- As you know, GH Rest API for pullRequests returns additions/deletions data
  only from "GET /pull_number" requests (and deeper), not from "GET /pulls" requests. Obtaining data for each PR means to make 1 request per PR;

- Since Rest API have rate limits and I'm moving in a simplified test/example approach, I've decided to use as Source of Truth a subset of results in front of the whole data that can come from an huge Repo. (this is valid ONLY for the first chart)
- This will lead to imperfect result in terms of precision (average in that chart is falsed from partial data) but most likely will avoid to have a 403 status when fetching data for repo with a lot of activities;

- For same reason I've tried to limit calls and reuse, whenever possible, data coming from first call only (getAllIssues), and to cache these result for a short period of time.

- Apologize but I didnt find a better approach to handle this issue given the scope/documentation/time I had

*for libraries*
- I've preferred to write service classes (no custom hooks) to mantain more agnosticism on data-layer. Service classes are written without use of React API and can be easily moved between different project and (personal opinion) better tested
- I've choosen to use Recharts instead of @clayui/charts as the documentation itself suggest to follow this path

## My contacts

email: danielemassi@gmail.com
github: https://github.com/doctorstones