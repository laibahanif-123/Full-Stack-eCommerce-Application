// client/src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const CATEGORIES = [
  { name: 'Electronics', icon: '📱', color: '#E3F2FD' },
  { name: 'Fashion', icon: '👗', color: '#FCE4EC' },
  { name: 'Home', icon: '🏠', color: '#E8F5E9' },
  { name: 'Sports', icon: '⚽', color: '#FFF3E0' },
  { name: 'Books', icon: '📚', color: '#F3E5F5' },
  { name: 'Toys', icon: '🧸', color: '#FFF8E1' },
  { name: 'Clothes', icon: '👕', color: '#E1F5FE' },
  { name: 'Makeup', icon: '💄', color: '#F8BBD0' },
];

const BANNERS = [
  { title: 'Mega Sale', subtitle: 'Up to 50% OFF on Electronics', bg: 'linear-gradient(135deg, #F85606 0%, #FF9800 100%)', cta: 'Shop Electronics' },
  { title: 'Fashion Week', subtitle: 'Latest trends at best prices', bg: 'linear-gradient(135deg, #E91E63 0%, #FF5722 100%)', cta: 'Shop Fashion' },
  { title: 'Home Essentials', subtitle: 'Transform your living space', bg: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)', cta: 'Shop Home' },
];

export default function HomePage() {
  const { products, fetchProducts, loading } = useStore();
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [flashTimer, setFlashTimer] = useState({ hours: 5, minutes: 23, seconds: 45 });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlashTimer((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (category) => {
    fetchProducts({ category });
    navigate('/products');
  };

  const flashSaleProducts = products.filter(p => p.originalPrice > p.price).slice(0, 8);
  const justForYou = products.slice(0, 12);
  const topRated = products.filter(p => p.rating >= 4.7).slice(0, 6);

  return (
    <div className="space-y-8 pb-8">
      <section className="page-container pt-4 animate-fade-up">
        <div className="flex gap-4">
          <div className="hidden lg:block w-52 card p-3 self-stretch flex-shrink-0">
            <h3 className="font-bold text-sm text-gray-800 mb-2 px-1">Categories</h3>
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-brand-500 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>

          <div className="flex-1 relative rounded-2xl overflow-hidden h-[260px] md:h-[320px] shadow-card">
            {BANNERS.map((banner, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8 transition-opacity duration-500 ${idx === currentBanner ? 'opacity-100' : 'opacity-0'}`}
                style={{ background: banner.bg }}
              >
                <h2 className="text-4xl md:text-5xl font-black mb-2">{banner.title}</h2>
                <p className="text-lg md:text-xl font-medium opacity-90 mb-6">{banner.subtitle}</p>
                <Link to="/products" className="bg-white text-brand-500 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm shadow-card">
                  {banner.cta} →
                </Link>
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {BANNERS.map((_, idx) => (
                <button key={idx} type="button" onClick={() => setCurrentBanner(idx)} className={`h-2.5 rounded-full transition-all ${idx === currentBanner ? 'bg-white w-6' : 'bg-white/50 w-2.5'}`} aria-label={`Banner ${idx + 1}`} />
              ))}
            </div>
            <button type="button" onClick={() => setCurrentBanner((currentBanner - 1 + BANNERS.length) % BANNERS.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
              <FiChevronLeft size={18} />
            </button>
            <button type="button" onClick={() => setCurrentBanner((currentBanner + 1) % BANNERS.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="page-container animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <FiTruck />, title: 'Free Delivery', desc: 'On orders above Rs.2000' },
            { icon: <FiShield />, title: 'Secure Payment', desc: '100% secure checkout' },
            { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '7-day return policy' },
            { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Dedicated help center' },
          ].map((item, i) => (
            <div key={i} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-brand-500 flex items-center justify-center text-lg flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                <p className="text-[10px] text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-container animate-fade-up" style={{ animationDelay: '0.15s' }}>
        <div className="card p-5">
          <h2 className="section-title mb-4">Shop by Category</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className="category-card"
                style={{ backgroundColor: cat.color }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="card p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="section-title">🔥 Flash Sale</h2>
              <div className="flex items-center gap-1">
                <span className="countdown-box">{String(flashTimer.hours).padStart(2, '0')}</span>
                <span className="text-gray-800 font-bold">:</span>
                <span className="countdown-box">{String(flashTimer.minutes).padStart(2, '0')}</span>
                <span className="text-gray-800 font-bold">:</span>
                <span className="countdown-box animate-tick">{String(flashTimer.seconds).padStart(2, '0')}</span>
              </div>
            </div>
            <Link to="/products" className="text-brand-500 font-semibold text-sm hover:underline flex items-center gap-1">
              Shop All Deals <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {flashSaleProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-container animate-fade-up" style={{ animationDelay: '0.25s' }}>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">⭐ Top Rated Products</h2>
            <Link to="/products" className="text-brand-500 font-semibold text-sm hover:underline flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {topRated.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-container animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">💡 Just For You</h2>
            <Link to="/products" className="text-brand-500 font-semibold text-sm hover:underline flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="card p-3 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-lg mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {justForYou.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
