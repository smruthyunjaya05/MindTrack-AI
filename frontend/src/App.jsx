import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import ChatbotWidget from './components/ChatbotWidget'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
      </Routes>
      
      {/* MindTrack AI Chatbot - Available on all pages */}
      <ChatbotWidget />
    </Layout>
  )
}

export default App
