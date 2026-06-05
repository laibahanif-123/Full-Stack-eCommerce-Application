// client/src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiLogOut, FiSearch, FiMenu, FiX, FiShield, FiSliders, FiHeart, FiChevronDown, FiPackage, FiSmartphone, FiHome, FiBook, FiStar } from 'react-icons/fi';
import { GiRunningShoe, GiCubes, GiShirt, GiLipstick } from 'react-icons/gi';
import { useStore } from '../store/store';

const CATEGORIES = [
  { name: 'Electronics', icon: <FiSmartphone /> },
  { name: 'Fashion', icon: <GiRunningShoe /> },
  { name: 'Home', icon: <FiHome /> },
  { name: 'Sports', icon: <FiStar /> },
  { name: 'Books', icon: <FiBook /> },
  { name: 'Toys', icon: <GiCubes /> },
  { name: 'Clothes', icon: <GiShirt /> },
  { name: 'Makeup', icon: <GiLipstick /> },
];

export default function Navbar() {
  const { user, cart, logout, fetchProducts, wishlist } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
  };

  const handleLogoutClick = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white text-xs py-2 text-center font-medium px-4 relative z-50 shadow-sm">
        <div className="page-container flex items-center justify-between">
          <span className="hidden sm:inline">🎉 Welcome to NovaCart! Free Shipping on orders over Rs. 2000</span>
          <span className="sm:hidden text-[11px]">🎉 Free Shipping on orders over Rs. 2000</span>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-white/90">
            <span className="hover:text-white hover:underline cursor-pointer transition-colors">Sell on NovaCart</span>
            <span className="hover:text-white hover:underline cursor-pointer transition-colors">Download App</span>
            <span className="hover:text-white hover:underline cursor-pointer transition-colors">Customer Care</span>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-40 shadow-nav border-b-2 border-brand-500/20 bg-gradient-to-b from-brand-50/50 via-white to-white backdrop-blur-md">
        <div className="page-container py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl md:text-3xl font-black tracking-tight flex-shrink-0 hover:opacity-90 transition-opacity flex items-center gap-1">
            <span className="hidden sm:flex w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-orange-400 items-center justify-center text-white text-sm shadow-md">N</span>
            <span>
              <span className="text-gray-800">Nova</span>
              <span className="text-brand-500">Cart</span>
            </span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Search in NovaCart..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-14 py-2.5 border-2 border-brand-500 rounded-xl text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 bg-brand-500 hover:bg-brand-600 text-white px-5 rounded-r-xl transition-colors flex items-center justify-center">
              <FiSearch size={18} />
            </button>
          </form>

          <div className="hidden md:flex items-center gap-1.5">
            <Link to="/products" className="relative p-2.5 text-brand-600 bg-orange-100/80 hover:bg-brand-500 hover:text-white transition-all rounded-xl" title="Wishlist">
              <FiHeart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2.5 text-brand-600 bg-orange-100/80 hover:bg-brand-500 hover:text-white transition-all rounded-xl" title="Shopping Cart">
              <FiShoppingCart size={22} />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 rounded-xl transition-colors text-sm text-gray-700 ml-1"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <FiChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-card-hover py-1 z-50 animate-slideDown">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>

                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-500 transition-colors"
                      >
                        <FiShield size={16} /> Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-500 transition-colors"
                        >
                          <FiSliders size={16} /> My Account
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-500 transition-colors"
                        >
                          <FiPackage size={16} /> My Orders
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 mt-1">
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                        <FiLogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="px-5 py-2 rounded-full text-sm font-semibold text-brand-500 border-2 border-brand-500 hover:bg-brand-500 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-colors shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <FiShoppingCart size={22} />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalCartCount}
                </span>
              )}
            </Link>
            <button type="button" className="text-brand-600 bg-orange-100 p-2 rounded-lg hover:bg-brand-500 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        <div className="hidden md:block bg-gradient-to-r from-brand-500/5 via-brand-50/30 to-brand-500/5 border-t border-brand-500/15">
          <div className="page-container flex items-center gap-1 py-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className="group flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 hover:text-white hover:bg-brand-500 rounded-lg transition-all font-medium"
              >
                <span className="text-brand-500 group-hover:text-white transition-colors">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
            <Link to="/products" className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors font-semibold ml-auto shadow-sm">
              View All →
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-brand-50 to-white border-t border-brand-500/20 px-4 py-4 space-y-3 shadow-nav animate-slideDown">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 border-2 border-brand-500 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 bg-brand-500 text-white px-4 rounded-r-xl">
                <FiSearch size={18} />
              </button>
            </form>

            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Categories</div>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex flex-col items-center gap-1 p-3 border border-gray-100 rounded-xl hover:border-brand-500 hover:text-brand-500 text-gray-600 transition-colors text-xs font-medium"
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-1">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-brand-500 hover:bg-orange-50 rounded-lg">
                All Products
              </Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex justify-between items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-brand-500 hover:bg-orange-50 rounded-lg">
                <span>Shopping Cart</span>
                <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{totalCartCount}</span>
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-3">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  {user.role === 'admin' ? (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:text-brand-500 hover:bg-orange-50 rounded-lg">
                      <FiShield size={16} /> Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:text-brand-500 hover:bg-orange-50 rounded-lg">
                      <FiPackage size={16} /> My Orders
                    </Link>
                  )}
                  <button type="button" onClick={() => { logout(); setMobileMenuOpen(false); navigate('/login'); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg font-medium text-left">
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2.5 rounded-full text-sm font-semibold text-brand-500 border-2 border-brand-500">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center py-2.5 rounded-full text-sm font-semibold text-white bg-brand-500">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
