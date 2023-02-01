import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { RQ_NETWORK_MODE } from "../services/constants"
import GithubService from "../services/GithubService"
import { Empty } from "./Empty"
import { Loading } from "./Loading"

const PullSizesGraph: FC = () => {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['pullSizes'],
    queryFn: GithubService.getPullsAverageSize,
    networkMode: RQ_NETWORK_MODE,
  })

  if(isLoading) {
    return <Loading size={"lg"} />
  }

  if(isError || !data) {
    return <Empty isError={isError} error={error} />
  }

  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <BarChart width={800} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 1" />
        <XAxis
          dataKey="name"
          // minTickGap={150}
          // tickFormatter={day => dayjs(day).format('DD MMM')}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="duration" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export { PullSizesGraph }