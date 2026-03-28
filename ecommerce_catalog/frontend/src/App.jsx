import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminProductPage from './pages/AdminProductPage';
import { ShoppingBag, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-150 relative group ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'}`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-3 shadow-sm'
            : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-brand-600 rounded-xl text-white shadow-lg shadow-brand-500/40 group-hover:scale-105 group-hover:bg-brand-700 transition-all duration-200">
              <ShoppingBag size={22} strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              Smart<span className="text-gradient">Catalog</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>
              Catalog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-600 rounded-full transition-all duration-200 group-hover:w-full" />
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} /> Admin
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-600 rounded-full transition-all duration-200 group-hover:w-full" />
              </NavLink>
            )}
          </nav>

          {/* Mobile menu btn */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 mt-0 px-6 py-6 space-y-4 shadow-xl">
            <NavLink to="/" end className="block text-lg font-semibold text-slate-800 hover:text-brand-600">Catalog</NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="flex items-center gap-2 text-lg font-semibold text-slate-800 hover:text-brand-600">
                <ShieldCheck size={18} /> Admin
              </NavLink>
            )}
          </div>
        )}
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          {isAdmin && <Route path="/admin" element={<AdminProductPage />} />}
        </Routes>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 text-sm py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white font-display font-bold">
            <Sparkles size={18} className="text-brand-400" />
            SmartCatalog
          </div>
          <p>&copy; {new Date().getFullYear()} Smart E-Commerce Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
