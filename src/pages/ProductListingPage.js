import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/store';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys', 'Clothes', 'Makeup'];
const SORT_OPTIONS = [
  { value: '', label: 'Best Match' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'sold', label: 'Most Popular' },
];

export default function ProductListingPage() {
  const location = useLocation();
  const { products, fetchProducts, loading, error } = useStore();
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '', sort: '' });
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category') || '';
    const search = params.get('search') || '';
    
    const initialFilters = { search, category, minPrice: '', maxPrice: '', sort: '' };
    setFilters(initialFilters);
    fetchProducts(initialFilters);
  }, [location.search, fetchProducts]);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    fetchProducts(filters);
    setShowMobileFilter(false);
  };

  const clearFilters = () => {
    const fresh = { search: '', category: '', minPrice: '', maxPrice: '', sort: '' };
    setFilters(fresh);
    fetchProducts(fresh);
  };

  const handleSortChange = (sortValue) => {
    const newFilters = { ...filters, sort: sortValue };
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handleCategorySelect = (cat) => {
    const newFilters = { ...filters, category: cat === filters.category ? '' : cat };
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const FilterForm = ({ className = '' }) => (
    <form onSubmit={applyFilters} className={`space-y-5 ${className}`}>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Search</label>
        <div className="relative">
          <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search products..." className="input-field pl-3 pr-8 py-2.5 text-xs" />
          <FiSearch className="absolute right-3 top-3 text-gray-400" size={14} />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Price Range (Rs.)</label>
        <div className="flex items-center gap-2">
          <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min" className="input-field py-2 text-xs" />
          <span className="text-gray-400 text-xs font-semibold">-</span>
          <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max" className="input-field py-2 text-xs" />
        </div>
      </div>
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <button type="submit" className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">Apply Filters</button>
        <button type="button" onClick={clearFilters} className="w-full py-1 text-xs text-gray-500 hover:text-brand-500 font-bold uppercase tracking-wider transition-colors">Reset All</button>
      </div>
    </form>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-4">
      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-4 self-start sticky top-24">
          <div className="card p-5">
            <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-150"><FiFilter className="text-brand-500" /> Filters</h3>
            <FilterForm />
          </div>
        </aside>

        <section className="flex-1 min-w-0 space-y-4">
          <div className="card p-3 mb-1 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <button type="button" onClick={() => setShowMobileFilter(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-650 hover:border-brand-500 bg-white">
                <FiFilter size={13} /> Filters
              </button>
              <span className="text-xs font-semibold text-gray-500">{products.length} products found</span>
              {filters.category && (
                <span className="bg-orange-50 text-brand-500 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  {filters.category}
                  <FiX size={12} className="cursor-pointer" onClick={() => handleCategorySelect('')} />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:inline">Sort by:</span>
              <select value={filters.sort} onChange={(e) => handleSortChange(e.target.value)} className="input-field py-2 w-auto min-w-[140px] text-xs font-semibold">
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {/* Horizontal Category Select Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 horizontal-scroll">
            <button
              type="button"
              onClick={() => handleCategorySelect('')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                !filters.category
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-100 hover:border-brand-500 hover:text-brand-500 shadow-sm'
              }`}
            >
              All Products
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  filters.category === cat
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-100 hover:border-brand-500 hover:text-brand-500 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="card p-3 animate-pulse">
                  <div className="h-44 bg-gray-100 rounded-lg mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card p-12 text-center shadow-sm">
              {error ? (
                <>
                  <p className="text-red-500 text-lg font-semibold mb-2">Could not load products</p>
                  <p className="text-sm text-gray-500 mb-4">{error}</p>
                  <p className="text-xs text-gray-400 mb-4">
                    Start backend: <code className="bg-gray-100 px-2 py-1 rounded">cd server &amp;&amp; npm start</code>
                  </p>
                  <button type="button" onClick={() => fetchProducts()} className="btn-primary px-6 py-2.5 rounded-xl text-sm">
                    Retry
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-500 text-lg mb-2">No products found</p>
                  <p className="text-sm text-gray-400 mb-4">Try adjusting your filters or search terms</p>
                  <button type="button" onClick={clearFilters} className="text-brand-500 font-semibold hover:underline text-sm">Clear all filters</button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} showStock />
              ))}
            </div>
          )}
        </section>
      </div>

      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} aria-label="Close filters" />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-card-hover animate-slideIn overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiFilter className="text-brand-500" /> Filters</h3>
              <button type="button" onClick={() => setShowMobileFilter(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <div className="p-4">
              <FilterForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
