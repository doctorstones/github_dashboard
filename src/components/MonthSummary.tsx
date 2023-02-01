import ClayCard from "@clayui/card"
import { Heading } from "@clayui/core"
import ClayTabs from "@clayui/tabs"
import { useQuery } from "@tanstack/react-query"
import { FC, useState } from "react"
import GithubService from "../services/GithubService"
import { Loading } from "./Loading"
import { MonthGraph } from "./MonthGraph"

const MonthSummary: FC = () => {

  const [active, setActive] = useState(0);

  const issues = useQuery({
    queryKey: ['issues'],
    queryFn: GithubService.getIssuesForPeriod,
  })

  const pulls = useQuery({
    queryKey: ['pulls'],
    queryFn: GithubService.getIssuesForPeriod,
  })

  const pullsCount = () => pulls.isLoading ?
    <Loading size="sm" /> :
    pulls.isError ? 0 :
      <>{pulls.data?.count}</>

  const issuesCount = () => issues.isLoading ?
    <Loading size="sm" /> :
    issues.isError ? 0 :
      <>{issues.data?.count}</>

  return (
    <ClayCard>
      <ClayCard.Description displayType="title">
        {"Month Summary"}
      </ClayCard.Description>
      <ClayTabs active={active} modern onActiveChange={setActive}>
        <ClayTabs.Item>
          <Heading level={4} weight="light">Pull Request</Heading>
          <Heading level={2} weight="normal">{pullsCount()}</Heading>
        </ClayTabs.Item>
        <ClayTabs.Item>
          <Heading level={4} weight="light">Issues</Heading>
          <Heading level={2} weight="normal">{issuesCount()}</Heading>
        </ClayTabs.Item>
      </ClayTabs>
      <ClayTabs.Content fade activeIndex={active} >
        <ClayTabs.TabPane tabIndex={0} >
          <div className="m-3">
            <MonthGraph data={issues.data?.graphData} />
          </div>
        </ClayTabs.TabPane>
        <ClayTabs.TabPane tabIndex={1} >

          <div className="m-3">
            <MonthGraph data={issues.data?.graphData} />
          </div>

        </ClayTabs.TabPane>
      </ClayTabs.Content>
    </ClayCard>
  )
}

export { MonthSummary }