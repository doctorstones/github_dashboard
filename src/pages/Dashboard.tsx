import Button from "@clayui/button";
import ClayCard from "@clayui/card";
import ClayToolbar from "@clayui/toolbar";
import { FC } from "react";
import { AverageMergeTime, Layout } from "../components";
import GithubService from "../services/GithubService";

const Dashboard: FC = () => {

  const handleButtonPull = async () => {
    const result = await GithubService.fetchAveragePRMergeTime()
    console.log(result)
  }

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col col-md-12 col-test">
            test
            <Button onClick={() => handleButtonPull()}>Pull</Button>
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
            <AverageMergeTime />
          </div>
          <div className="col col-6">
            <ClayCard>
              <ClayToolbar>
                {"Average Issue Close Time"}
              </ClayToolbar>
            </ClayCard>
          </div>
        </div>
        <div className="row">
          <div className="col col-12">

            <ClayCard>
              <ClayToolbar>
                {"Month Summary"}
              </ClayToolbar>
            </ClayCard>
          </div>
        </div>
      </div>

    </Layout>
  )
}

export default Dashboard;