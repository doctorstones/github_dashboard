import { FC, ReactNode } from "react"

type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="container d-flex flex-row">
      <nav className="navigation d-flex flex-column text-center navbar navbar-light hide-scrollbar">
        LOGO
      </nav>
      <main>
        <header className="p-1 shadow">
          <h1>Liferay</h1>
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