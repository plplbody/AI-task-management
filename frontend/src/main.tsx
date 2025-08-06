import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/TaskManagementPage.tsx';
import GlobalStyle from './GlobalStyles.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
