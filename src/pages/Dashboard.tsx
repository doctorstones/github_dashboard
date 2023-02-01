import Button from "@clayui/button";
import ClayCard from "@clayui/card";
import ClayToolbar from "@clayui/toolbar";
import { FC } from "react";
import { AverageTime, Layout, MonthSummary } from "../components";
import { PREVIEW } from "../services/constants";
import GithubService from "../services/GithubService";

const Dashboard: FC = () => {

  const handleButtonPull = async () => {
    const result = await GithubService.getAllIssues('pulls')
    PREVIEW&&console.log(result)
  }

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col col-md-12 col-test">
            <ClayCard>
              test
              <Button onClick={() => handleButtonPull()}>Issues</Button>
            </ClayCard>
          </div>
        </div>
        <div className="row">
          <div className="col col-12">
            <ClayCard>
              <ClayToolbar>
                {"average merge time by pull request size"}
              </ClayToolbar>
              <ClayCard.Body>
                here goes the chart
              </ClayCard.Body>
            </ClayCard>

          </div>
        </div>
        <div className="row">
          <div className="col col-6">
            <AverageTime category="pullRequests" />
          </div>
          <div className="col col-6">
            <AverageTime category="issues" />
          </div>
        </div>
        <div className="row">
          <div className="col col-12">
            <MonthSummary />
          </div>
        </div>
      </div>

    </Layout>
  )
}

export default Dashboard;