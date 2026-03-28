import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import Pagination from '../components/Pagination';
import { LayoutGrid, PackageSearch, SlidersHorizontal, X } from 'lucide-react';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0, total: 0 });
    const [filters, setFilters] = useState({ keyword: '', minPrice: '', maxPrice: '' });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchProducts(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchProducts(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            if (res.data.success) setCategories(res.data.data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const fetchProducts = async (page = 0) => {
        setLoading(true);
        setError(null);
        try {
            const params = { page, size: 12, status: 'ACTIVE' };
            if (selectedCategory) params.categoryId = selectedCategory;
            if (filters.keyword) params.keyword = filters.keyword;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;

            const res = await api.get('/products', { params });
            if (res.data.success) {
                setProducts(res.data.data.content ?? []);
                setPagination({
                    page: res.data.data.pageable?.pageNumber ?? 0,
                    totalPages: res.data.data.totalPages ?? 0,
                    total: res.data.data.totalElements ?? 0,
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load products. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (p) => {
        fetchProducts(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const gridContent = () => {
        if (loading) return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="card overflow-hidden">
                        <div className="skeleton aspect-[4/3] w-full" />
                        <div className="p-5 space-y-3">
                            <div className="skeleton h-3 w-1/3 rounded" />
                            <div className="skeleton h-5 w-4/5 rounded" />
                            <div className="skeleton h-4 w-2/4 rounded mt-4" />
                        </div>
                    </div>
                ))}
            </div>
        );

        if (error) return (
            <div className="card flex flex-col items-center justify-center p-16 text-center gap-4 border-rose-100">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <X size={24} className="text-rose-500" />
                </div>
                <div>
                    <h3 className="font-display font-bold text-slate-900 mb-1">Something went wrong</h3>
                    <p className="text-slate-500 text-sm">{error}</p>
                </div>
                <button onClick={() => fetchProducts(0)} className="btn-primary text-sm">Try Again</button>
            </div>
        );

        if (products.length === 0) return (
            <div className="card flex flex-col items-center justify-center p-16 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center">
                    <PackageSearch size={28} className="text-brand-400" />
                </div>
                <div>
                    <h3 className="font-display font-bold text-slate-900 text-lg mb-1">No products found</h3>
                    <p className="text-slate-500 text-sm">Try adjusting your search or clearing the filters.</p>
                </div>
                <button
                    onClick={() => { setFilters({ keyword: '', minPrice: '', maxPrice: '' }); setSelectedCategory(null); setTimeout(() => fetchProducts(0), 50); }}
                    className="btn-secondary text-sm"
                >
                    Clear Filters
                </button>
            </div>
        );

        return (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product, i) => (
                        <div key={product.id} className="animate-fade-up opacity-0" style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'forwards' }}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
                {pagination.totalPages > 1 && (
                    <div className="mt-12">
                        <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                    </div>
                )}
            </>
        );
    };

    return (
        <div>
            {/* Hero */}
            <div className="mb-10 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-slate-800 text-white p-8 md:p-12 shadow-2xl shadow-brand-800/30">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
                    <div className="relative z-10 max-w-xl">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold uppercase tracking-widest mb-4">
                            ✦ New Arrivals 2026
                        </span>
                        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-4">
                            Discover Premium Products
                        </h1>
                        <p className="text-brand-100 text-base md:text-lg leading-relaxed max-w-md">
                            Curated electronics, apparel, and accessories crafted for modern living.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-display font-bold text-slate-900 text-xl flex items-center gap-2">
                        <LayoutGrid size={20} className="text-brand-500" />
                        Explore Catalog
                    </h2>
                    {!loading && !error && (
                        <p className="text-sm text-slate-500 mt-0.5">{pagination.total} products</p>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(v => !v)}
                    className={`lg:hidden btn-secondary text-sm gap-2 ${showFilters ? 'border-brand-300 text-brand-600 bg-brand-50' : ''}`}
                >
                    <SlidersHorizontal size={16} /> Filters
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className={`w-full lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="card sticky top-24 overflow-hidden border border-slate-100">
                        <ProductFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={id => { setSelectedCategory(id); setShowFilters(false); }}
                            filters={filters}
                            onFilterChange={setFilters}
                            onSearchSubmit={() => { fetchProducts(0); setShowFilters(false); }}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 min-w-0">
                    {gridContent()}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
