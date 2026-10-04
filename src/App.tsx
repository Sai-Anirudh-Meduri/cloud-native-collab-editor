import { Route, Routes } from 'react-router'
import Dashboard from './ui/pages/Dashboard'
import DocumentPage from './ui/pages/DocumentPage'
import LoginPage from './ui/pages/LoginPage'
import RegisterPage from './ui/pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/documents/:documentId" element={<DocumentPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
