import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Mail, Settings } from 'lucide-react';
import NotificationPage from './pages/NotificationPage';
import NotificationBell from './components/NotificationBell';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center shadow-none no-underline group">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3 group-hover:bg-blue-200 transition">
                     <Mail className="h-5 w-5 text-blue-600" />
                  </span>
                  <span className="text-xl font-bold text-gray-900 tracking-tight">Notification Center</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                 <NotificationBell />
                 <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                    <Settings className="w-5 h-5"/>
                 </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<NotificationPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
