import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import SearchBar from '../components/SearchBar';
import SearchFilters from '../components/SearchFilters';
import SortSelector from '../components/SortSelector';
import SearchResultsGrid from '../components/SearchResultsGrid';
import PopularSearches from '../components/PopularSearches';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const INITIAL_FILTERS = { category: '', minPrice: '', maxPrice: '', inStock: false };

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [committed, setCommitted] = useState('');           // last executed search term
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(0);
  const [results, setResults] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [facets, setFacets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const executeSearch = useCallback(async (q, f, s, p) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = {
        q: q || undefined,
        category: f.category || undefined,
        minPrice: f.minPrice || undefined,
        maxPrice: f.maxPrice || undefined,
        inStock: f.inStock || undefined,
        sort: s,
        page: p,
        size: 12,
      };
      const res = await api.get('', { params });
      setResults(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
      setFacets(res.data.facets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-search when filters/sort/page change (but only after first search)
  useEffect(() => {
    if (hasSearched) {
      executeSearch(committed, filters, sort, page);
    }
  }, [filters, sort, page]);

  const handleSearch = (q) => {
    const term = q ?? query;
    setCommitted(term);
    setPage(0);
    executeSearch(term, filters, sort, 0);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Hero Search Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-white/20 p-2.5 rounded-xl">
              <Search className="h-6 w-6 text-white" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Smart Product Search</h1>
          </div>
          <SearchBar query={query} onQueryChange={setQuery} onSearch={handleSearch} />
          {!hasSearched && (
            <div className="mt-4">
              <PopularSearches onSelect={(q) => { setQuery(q); handleSearch(q); }} />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!hasSearched ? (
          /* Landing state */
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-gray-700">Search 50+ products</h2>
            <p className="text-gray-400 mt-2 text-sm">iPhones, laptops, headphones, cameras & more with instant autocomplete</p>
            <button onClick={() => handleSearch('')}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition">
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <SearchFilters facets={facets} filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {/* Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500">
                  {loading ? 'Searching…' : <><span className="font-bold text-gray-900">{totalElements.toLocaleString()}</span> results{committed ? <> for <span className="text-indigo-600 font-semibold">"{committed}"</span></> : ''}</>}
                </p>
                <SortSelector value={sort} onChange={(s) => { setSort(s); setPage(0); }} />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <SearchResultsGrid results={results} totalElements={totalElements} />
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                    className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + Math.max(0, page - 2)).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${p === page ? 'bg-indigo-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {p + 1}
                      </button>
                    ))}
                  </div>
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                    className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
