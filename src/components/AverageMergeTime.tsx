import Button from "@clayui/button"
import ClayCard from "@clayui/card"
import ClayLoadingIndicator from "@clayui/loading-indicator"
import ClayToolbar from "@clayui/toolbar"
import { useQuery } from "@tanstack/react-query"
import { FC, Suspense } from "react"
import GithubService from "../services/GithubService"

const AverageMergeTime: FC = () => {

  const { data, isError, error, refetch } = useQuery({
    queryKey: ['aprmt'],
    queryFn: GithubService.fetchAveragePRMergeTime,
    networkMode: 'always'
  })

  return (
    <ClayCard>
      <ClayToolbar>
        {"Average Pull Request Merge Time"}
      </ClayToolbar>
      <ClayCard.Body>
        {isError ? (
          <>
          </>
        ) : (
          <Suspense fallback={
            <ClayLoadingIndicator displayType="primary" shape="squares" size="lg" />
          }>
            {data}
          </Suspense>
        )}
      </ClayCard.Body>
    </ClayCard>
  )
}

export { AverageMergeTime }