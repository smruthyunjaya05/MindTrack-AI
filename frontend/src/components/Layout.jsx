import { Link, useLocation } from 'react-router-dom'
import { Brain, Home } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Glassmorphic Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-tertiary/80 backdrop-blur-20 border-b border-border-subtle shadow-glass">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-18">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <Brain className="w-8 h-8 text-accent-primary group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,125,41,0.4)]" />
              <h1 className="text-2xl font-bold">
                <span className="text-white">MindTrack</span>{' '}
                <span className="gradient-text">AI</span>
              </h1>
            </Link>
            
            {/* Navigation */}
            <nav className="flex gap-2">
              <Link
                to="/"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-12 transition-all ${
                  isActive('/')
                    ? 'bg-gradient-primary text-white shadow-[0_2px_8px_rgba(255,125,41,0.3)]'
                    : 'text-text-secondary hover:text-white hover:bg-bg-elevated'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>
              
              <Link
                to="/analyze"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-12 transition-all ${
                  isActive('/analyze')
                    ? 'bg-gradient-primary text-white shadow-[0_2px_8px_rgba(255,125,41,0.3)]'
                    : 'text-text-secondary hover:text-white hover:bg-bg-elevated'
                }`}
              >
                <Brain className="w-5 h-5" />
                <span className="font-medium">Analyze</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content with top padding for fixed header */}
      <main className="pt-18">
        {children}
      </main>
    </div>
  )
}
