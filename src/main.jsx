import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router';
import ApplicationContext from './context/ApplicationContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <ApplicationContext>
    <AuthProvider>
   <Router>
  <StrictMode>
    <App />
  </StrictMode>,
   </Router>,
   </AuthProvider>
   </ApplicationContext>
)
