import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Import foundational design tokens, globals, and responsive styles
import './styles/variables.css';
import './styles/globals.css';
import './styles/responsive.css';

// Mount React application to DOM root element
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
