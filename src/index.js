import { CssBaseline } from '@mui/material';
import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
import disableReactDevTools from './disableReactDevTools';
import './index.css';

if (process.env.NODE_ENV === 'production') disableReactDevTools();

render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>,
  document.getElementById('root')
);
