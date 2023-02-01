import { useQuery } from "@tanstack/react-query"
import { FC } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import GithubService from "../services/GithubService"
import { Empty } from "./Empty"
import { Loading } from "./Loading"

const PullSizesGraph: FC = () => {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['pullSizes'],
    queryFn: GithubService.getPullsBySize,
  })

  if(isLoading) {
    return <Loading size={"lg"} />
  }

  if(isError || !data) {
    return <Empty isError={isError} error={error} />
  }

  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarChart width={800} height={300} data={data} data-testid="barchart">
        <CartesianGrid strokeDasharray="3 1" />
        <XAxis
          dataKey="name"
         />
        <YAxis 
          tickFormatter={hour => hour+'h'}
        />
        <Tooltip 
          formatter={(v)=>[Number(v).toFixed(2),'Average Time']}
        />
        <Legend />
        <Bar dataKey="duration" fill="#4B9BFF" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export { PullSizesGraph }