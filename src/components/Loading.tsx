import ClayLoadingIndicator from "@clayui/loading-indicator"
import { FC } from "react"

interface Props {
  size: "sm" | "lg"
}

const Loading: FC<Props> = ({ size }) => {
  return (
    <ClayLoadingIndicator displayType="primary" shape="squares" size={size ?? "md"} 
      data-testid="loading"
    />
  )
}

export { Loading }