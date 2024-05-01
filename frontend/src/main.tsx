import React from 'react'
import ReactDOM from 'react-dom/client'

import './modules/scss/main.scss';

import App from './app/app'
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
