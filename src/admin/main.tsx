import React from 'react';
import ReactDOM from 'react-dom/client';
import { Admin } from '../pages/Admin';
import '../index.css';
import '../i18n';

const storedTheme = localStorage.getItem('theme-storage');
const theme = storedTheme?.includes('"theme":"light"') ? 'light' : 'dark';
document.documentElement.classList.add(theme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-background text-foreground">
      <Admin />
    </div>
  </React.StrictMode>
);