import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Posts from './pages/Posts'
import Projects from './pages/Projects'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import { useAuthStore } from './stores/authStore'

function App() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-bg">
        <Login />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </motion.div>
      </Layout>
    </div>
  )
}

export default App