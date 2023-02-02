# Dashboard Application

## Install Project

1. Download and unzip the file in a folder
2. From shell, go in that folder and type
   `yarn` (or `npm i --force`).

## Basic Configuration

To be run properly, project needs some environment variables.
In the root folder, create a new file `.env` and paste this **before building**:

```
REACT_APP_DEBUG=true
REACT_APP_GH_TOKEN=[Your personal Token on Github]
REACT_APP_GH_REPO_OWNER=recharts <- Repo owner
REACT_APP_GH_REPO_NAME=recharts <- Repo owner
```

\*\*
For example, If you want to address dashboard data to https://github.com/doctorstones/ga-test, change variables to

```
REACT_APP_GH_REPO_OWNER=doctorstones
REACT_APP_GH_REPO_NAME=ga-test
```
Please note that the repo I've used as example (recharts) will require about 20secs to load data, because it contains a lot of issues/PR.

## Run Project

Project can be run in develop or built.

1. To run in develop, type from shell `yarn start` (or `npm run start`)
1. To build, type from shell `yarn build`
1. To run the build, type from shell `serve -s build`


### Some info on approach I've followed

*for data*
- I never used before Github Rest API, so probably my lack of knowledge could had lead to some issue
- Additions/deletions/changes properties are returned only from "GET /pulls/{pull_number}" requests and not also from "GET /pulls" requests, so obtaining data for each PR requires 1 request /PR;

- Since Rest API have rate limits and I'm moving in a simplified test/example approach, **only for the first chart** I've decided to use as Source of Truth a subset of results in front of the whole data that can come from an huge Repo. 
This will lead to imperfect result in terms of precision (average in that chart is falsed from partial data) but most likely will avoid to have a 403 status when fetching data for repo with a lot of activities - ofc the limit could be removed;

- For same reason I've tried to limit calls and reuse, whenever possible, data coming from first call only (getAllIssues), and to cache these result at least for a short period of time.

- Apologize but I didnt find a better approach to handle this issue given the scope/documentation/time I had

*for libraries*
- I've preferred to write service objects (no custom hooks) to mantain more agnosticism on data-layer. Service objects are written without use of React, so can be easily switched between different projects and (personal opinion) better tested
- I've choosen to use Recharts instead of @clayui/charts as the documentation itself suggest to follow this path

## My contacts

email: danielemassi@gmail.com
github: https://github.com/doctorstones