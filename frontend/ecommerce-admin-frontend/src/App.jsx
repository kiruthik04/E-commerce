import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarNav from './components/SidebarNav';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminSellersPage from './pages/AdminSellersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminReportsPage from './pages/AdminReportsPage';

function App() {
  return (
    <Router>
      <div className="flex bg-gray-950 min-h-screen">
        <SidebarNav />
        <main className="ml-64 flex-1 p-8 overflow-auto">
          <Routes>
            <Route path="/"        element={<AdminDashboardPage />} />
            <Route path="/sellers" element={<AdminSellersPage />} />
            <Route path="/users"   element={<AdminUsersPage />} />
            <Route path="/reports" element={<AdminReportsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
