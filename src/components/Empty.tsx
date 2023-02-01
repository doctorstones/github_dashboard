import ClayEmptyState from "@clayui/empty-state"
import { FC } from "react"

interface Props {
  title?: string
  description?: string
  error?: unknown,
  isError?: boolean
}

const Empty: FC<Props> = ({ title, description, error, isError }: Props) => {
  return (
    <div className="text-center">
      <ClayEmptyState
        title={"No Data"}
        description={description??''}
      />
    </div>
  )
}

export { Empty }