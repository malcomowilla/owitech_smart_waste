import { useState, lazy } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

import {
 
  Route,
  Routes,
   useNavigate
} from "react-router";

const DashboardTab = lazy(() => import('./components/DashboardTab'))
const NotFound = lazy(() => import('./pages/NotFound'))
const SignupPage = lazy(() => import('./pages/auth/SignupPage'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/collector-dashboard" element={<DashboardTab />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<SignupPage />} />
      <Route path="/signin" element={<LoginPage />} />


    </Routes>

    </>
  )
}

export default App
