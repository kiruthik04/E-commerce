import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center shadow-none no-underline">
                  <span className="text-xl font-bold text-gray-900 ml-2">Smart E-commerce Orders</span>
                </Link>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                   <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                     My Orders
                   </Link>
                   {/* In a real app, this link would be conditionally rendered based on admin role */}
                   <Link to="/admin" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-red-500 hover:text-red-700 hover:border-red-300">
                     Admin Dashboard
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<OrderListPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/admin" element={<AdminOrdersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
