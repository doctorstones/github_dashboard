import ClayCard from "@clayui/card"
import ClayLoadingIndicator from "@clayui/loading-indicator"
import ClayToolbar from "@clayui/toolbar"
import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import GithubService from "../services/GithubService"

type Category = 'pullRequests' | 'issues'

interface Props {
  category: Category
}

const AverageTime: FC<Props> = ({ category }) => {

  const { data, isError, isLoading, isSuccess, error } = useQuery({
    queryKey: ['averageTime', category],
    queryFn: averageData(category).function,
    networkMode: 'always'
  })

  return (
    <ClayCard>
      <ClayToolbar>
        {averageData(category).title}
      </ClayToolbar>
      <ClayCard.Body>
        {isLoading && (
          <ClayLoadingIndicator displayType="primary" shape="squares" size="lg" />
        )}
        {isError && (
          <>
            {error}
          </>
        )}
        {isSuccess && (
          <>
            {data}
          </>
        )}
      </ClayCard.Body>
    </ClayCard>
  )
}

const averageData = (category: Category) => { // TODO can be handled better (enum? map?)
  switch (category) {
    case "pullRequests":
      return {
        title: "Average Pull Request Merge Time",
        function: GithubService.getAveragePRMergeTime
      };
    case "issues":
    default:
      return {
        title: "Average Issue Close Time",
        function: GithubService.getIssuesAverageCloseTime
      };
  }
}

export { AverageTime }