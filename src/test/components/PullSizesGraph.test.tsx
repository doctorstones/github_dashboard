import { QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import { queryClient } from "../../App"
import { PullSizesGraph } from "../../components"

describe('PullSizesGraph', () => {

  it('renders properly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PullSizesGraph />
      </QueryClientProvider>
    )

    const loading = screen.getByTestId('loading');
    expect(loading).toBeInTheDocument()
  })

  it.skip('Render Chart', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PullSizesGraph />
      </QueryClientProvider>
    )
    const chart = await screen.findByTestId("barchart")
    expect(chart).toBeInTheDocument()
  })

})