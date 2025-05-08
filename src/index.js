import React from 'react';
import ReactDOM from 'react-dom'; // Use react-dom for React 17
import App from './App.jsx';
import './styles.css';

if (process.env.NODE_ENV !== 'production') {
  console.log('index.js: Starting render');
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

if (process.env.NODE_ENV !== 'production') {
  console.log('index.js: Render complete');
}