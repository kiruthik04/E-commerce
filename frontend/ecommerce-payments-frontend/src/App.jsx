import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center shadow-none no-underline">
                  <CreditCard className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">Secure Checkout</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
          <Routes>
            {/* The :orderId and :amount would usually come via state or URL params from the Order Microservice */}
            <Route path="/pay/:orderId" element={<PaymentPage />} />
            <Route path="/success" element={<PaymentSuccessPage />} />
            <Route path="/failure" element={<PaymentFailurePage />} />
            {/* Development fallback route to simulate an order drop-in */}
            <Route path="/" element={<PaymentPage simulateMode={true} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
