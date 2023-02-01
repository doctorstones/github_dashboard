import dayjs from "dayjs"
import { FC } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Timeseries } from "../services/utils"
import { Empty } from "./Empty"

interface Props {
  data?: Timeseries[]
}

const MonthGraph: FC<Props> = ({ data }: Props) => {

  if (!data) {
    return (
      <Empty description="Graph is Empty" />
    )
  }

  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <LineChart width={800} height={300} data={data}>
        <Line type="monotone" dataKey="closed" stroke="#36cf27" strokeWidth={2} />
        <Line type="monotone" dataKey="opened" stroke="#ff3a00" strokeWidth={2} />
        <CartesianGrid strokeDasharray="3 1" />
        <XAxis
          dataKey="day"
          minTickGap={150}
          tickFormatter={day => dayjs(day).format('DD MMM')}
        />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  )
}

export { MonthGraph }