import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import TrackingPage from './pages/TrackingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center shadow-none no-underline">
                  <PackageSearch className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">Track Order</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/:orderId" element={<TrackingPage />} />
            {/* Fallback for development */}
            <Route path="/" element={<TrackingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
