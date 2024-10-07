import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import global styles
import TravelingSalesmanGame from './App'; // Import your main component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TravelingSalesmanGame />
  </React.StrictMode>
);

