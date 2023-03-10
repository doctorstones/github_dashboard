import React from 'react';
import Dashboard from './pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Imports the @clayui/css package CSS
import "@clayui/css/lib/css/atlas.css";
import { RQ_NETWORK_MODE } from './services/constants';

export const queryClient = new QueryClient(
  {defaultOptions:{
    queries:{
      networkMode:RQ_NETWORK_MODE,
      retry:2
    }
  }}
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
