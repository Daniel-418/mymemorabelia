import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './LandingPage'
import LoginScreen from './LoginScreen'
import CapsuleList from './CapsuleList'
import CreateCapsuleForm from './CreateCapsuleForm'
import ViewMemory from './ViewMemory'
import SignUpScreen from './SignUpScreen'
import ProtectedRoute from '../components/layout/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/capsules" element={<CapsuleList />} />
          <Route path="/capsules/new" element={<CreateCapsuleForm />} />
          <Route path="/capsules/:id" element={<ViewMemory />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
