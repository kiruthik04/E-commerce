import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Star, Shield } from 'lucide-react';
import ReviewsPage from './pages/ReviewsPage';
import AdminModerationPage from './pages/AdminModerationPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 no-underline">
              <span className="bg-yellow-100 p-2 rounded-lg"><Star className="h-5 w-5 text-yellow-500 fill-yellow-400" /></span>
              <span className="text-xl font-bold text-gray-900">Reviews & Ratings</span>
            </Link>
            <div className="flex items-center space-x-1">
              <NavLink to="/" end className={({isActive}) => `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-yellow-50 text-yellow-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                Product Reviews
              </NavLink>
              <NavLink to="/admin" className={({isActive}) => `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-red-50 text-red-800' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Shield className="h-4 w-4 mr-1" /> Admin
              </NavLink>
            </div>
          </div>
        </nav>
        <main className="flex-1 max-w-6xl w-full mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<ReviewsPage />} />
            <Route path="/admin" element={<AdminModerationPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
