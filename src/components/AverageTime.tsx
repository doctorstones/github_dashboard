import ClayCard from "@clayui/card"
import { Heading } from "@clayui/core"
import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import GithubService from "../services/GithubService"
import { Empty } from "./Empty"
import { Loading } from "./Loading"

type Category = 'pullRequests' | 'issues'

interface Props {
  category: Category
}

const AverageTime: FC<Props> = ({ category }) => {

  const { data, isError, isLoading, isSuccess, error } = useQuery({
    queryKey: ['averageTime', category],
    queryFn: averageData(category).function
  })

  return (
    <ClayCard>
      <ClayCard.Description displayType="title">
        {averageData(category).title}
      </ClayCard.Description>

      <ClayCard.Body>
        {isLoading && (
          <Loading size={"lg"} />
        )}
        {isError && (
          <Empty isError={isError} error={error} />
        )}
        {isSuccess && (
          <div className="text-center py-4 px-2">
            <Heading level={3} fontSize={1} weight="semi-bold">{data}</Heading>
          </div>
        )}
      </ClayCard.Body>
    </ClayCard>
  )
}

const averageData = (category: Category) => { 
  switch (category) {
    case "pullRequests":
      return {
        title: "Average Pull Request Merge Time",
        function: GithubService.getPullsAverageMergeTime
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