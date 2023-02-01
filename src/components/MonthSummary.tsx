import ClayCard from "@clayui/card"
import { Heading } from "@clayui/core"
import ClayLoadingIndicator from "@clayui/loading-indicator"
import ClayTabs from "@clayui/tabs"
import ClayToolbar from "@clayui/toolbar"
import { useQuery } from "@tanstack/react-query"
import { FC, useState } from "react"
import { PREVIEW } from "../services/constants"
import GithubService from "../services/GithubService"
import { MonthGraph } from "./MonthGraph"

const MonthSummary: FC = () => {

  const [active, setActive] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['issuesMonthSummary'],
    queryFn: GithubService.getIssuesForPeriod,
    networkMode: 'always',
  })

  PREVIEW && console.log('isLoading', isLoading, data)

  // const pullsCount = isLoading ? <ClayLoadingIndicator displayType="primary" shape="squares" size="sm" /> : <>{data?.count}</>

  const issuesCount = isLoading ?
    <ClayLoadingIndicator displayType="primary" shape="squares" size="sm" /> :
    <>{data?.count}</>

  return (
    <ClayCard>
      <ClayToolbar>
        {"Month Summary"}
      </ClayToolbar>
      <ClayTabs active={active} modern onActiveChange={setActive}>
        <ClayTabs.Item
          innerProps={{
            "aria-controls": "tabpanel-1"
          }}
        >
          <Heading level={4}>Pull Request</Heading>
          <Heading level={1}>{0}</Heading>
        </ClayTabs.Item>
        <ClayTabs.Item
          innerProps={{
            "aria-controls": "tabpanel-1"
          }}
        >
          <Heading level={4}>Issues</Heading>
          <Heading level={1}>{issuesCount}</Heading>
        </ClayTabs.Item>
      </ClayTabs>
      <ClayTabs.Content fade activeIndex={active} >
        <ClayTabs.TabPane tabIndex={0} aria-labelledby="tab-1">
          1. Proin efficitur imperdiet dolor, a iaculis orci lacinia eu.
        </ClayTabs.TabPane>
        <ClayTabs.TabPane tabIndex={1} aria-labelledby="tab-2">

          <div className="m-3">
            <MonthGraph data={data?.graphData} />
          </div>

        </ClayTabs.TabPane>
      </ClayTabs.Content>
    </ClayCard>
  )
}

export { MonthSummary }