import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

if (process.env.NODE_ENV !== 'production') {
  console.log('index.js: Starting render');
}
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (process.env.NODE_ENV !== 'production') {
  console.log('index.js: Render complete');
}