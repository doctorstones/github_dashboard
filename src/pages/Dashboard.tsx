import ClayCard from "@clayui/card";
import { FC } from "react";
import { AverageTime, MonthSummary, PullSizesGraph } from "../components";
import { Layout } from "./templates/Layout";

const Dashboard: FC = () => {

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col col-12">
            <ClayCard>
              <ClayCard.Description displayType="title">
                {"Average Merge Time by Pull Request Size"}
              </ClayCard.Description>
              <ClayCard.Body>
                <div className="m-3">
                  <PullSizesGraph />
                </div>
              </ClayCard.Body>
            </ClayCard>

          </div>
        </div>
        <div className="row">
          <div className="col col-md-6">
            <AverageTime category="pullRequests" />
          </div>
          <div className="col col-md-6">
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