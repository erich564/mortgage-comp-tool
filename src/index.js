import { CssBaseline } from '@mui/material';
import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
import './index.css';

render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>,
  document.getElementById('root')
);
