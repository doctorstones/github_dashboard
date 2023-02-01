import { Heading } from "@clayui/core"
import { FC, ReactNode } from "react"

type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="container-fluid d-flex flex-row position-relative m-0 p-0">
      <nav className="flex-column text-center navbar hide-scrollbar">
        <div id="logo" className="logo">
          LR
        </div>
      </nav>
      <main>
        <header className="py-2 px-4 mb-4 shadow">
          <Heading level={1} weight="light">Liferay</Heading>
          <h5 className="text-muted">liferay-portal</h5>
        </header>
        <div className="container">
          <div className="row">
            <div className="col">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export { Layout }