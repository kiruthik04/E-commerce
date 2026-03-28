import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col">
        <nav className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center space-x-3">
            <span className="bg-violet-500/20 p-2 rounded-lg">
              <BarChart2 className="h-5 w-5 text-violet-400" />
            </span>
            <Link to="/" className="text-xl font-bold text-white no-underline tracking-tight">
              Analytics <span className="text-violet-400">Dashboard</span>
            </Link>
            <span className="text-[11px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full ml-2">Port 8091</span>
          </div>
        </nav>
        <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<AdminDashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
