import React from 'react';
import ReactDOM from 'react-dom/client';

import { StyledEngineProvider } from '@mui/material';

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </React.StrictMode>,
);
