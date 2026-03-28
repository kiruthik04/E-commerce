import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import AdminInventoryPage from './pages/AdminInventoryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 space-x-3">
              <span className="bg-emerald-100 p-2 rounded-lg">
                <Package className="h-5 w-5 text-emerald-700" />
              </span>
              <Link to="/" className="text-xl font-bold text-slate-900 tracking-tight no-underline">
                Inventory Admin
              </Link>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full ml-2">Port 8089</span>
            </div>
          </div>
        </nav>
        <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<AdminInventoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
