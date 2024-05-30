import { Box, CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.scss';
import { PageLoading } from './components/molecules/pageLoading';
import AppRoutes from './routes/appRoutes';
import { useLoadingStore } from './store/loading.store';
import theme from './theme';
import './theme/reset.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

function App() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box className="relative page-container">
            <PageLoading isLoading={isLoading} />
            <AppRoutes />
          </Box>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
}

export default App;
