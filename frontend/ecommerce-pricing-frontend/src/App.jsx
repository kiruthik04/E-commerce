import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Tag, Calculator } from 'lucide-react';
import AdminCouponsPage from './pages/AdminCouponsPage';
import PricingCalculatorPage from './pages/PricingCalculatorPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-orange-100 p-2 rounded-lg"><Tag className="h-5 w-5 text-orange-500" /></span>
              <span className="text-xl font-bold text-gray-900">Pricing <span className="text-orange-500">&amp; Discounts</span></span>
            </div>
            <div className="flex gap-1">
              {[
                { to: '/', label: 'Price Calculator', Icon: Calculator },
                { to: '/admin', label: 'Coupon Admin', Icon: Tag },
              ].map(({ to, label, Icon }) => (
                <NavLink key={to} to={to} end
                  className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <Icon className="h-4 w-4" /> {label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
        <main className="flex-1 max-w-6xl w-full mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<PricingCalculatorPage />} />
            <Route path="/admin" element={<AdminCouponsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
