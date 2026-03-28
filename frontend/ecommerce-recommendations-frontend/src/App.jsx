import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import RecommendationsDemoPage from './pages/RecommendationsDemoPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-transparent flex flex-col">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center shadow-none no-underline group">
                  <span className="bg-indigo-100 p-2 rounded-lg mr-2 group-hover:bg-indigo-200 transition">
                     <Sparkles className="h-5 w-5 text-indigo-600" />
                  </span>
                  <span className="text-xl font-bold text-gray-900 tracking-tight">AI Shop</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto py-8">
          <Routes>
            <Route path="/" element={<RecommendationsDemoPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
