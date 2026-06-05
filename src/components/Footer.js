// client/src/components/Footer.js
import React from 'react';
import { FiTwitter, FiFacebook, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-gray-300 text-sm mt-12">
      <div className="bg-brand-500">
        <div className="page-container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white text-center md:text-left">
            <h3 className="text-xl font-bold">Subscribe to our Newsletter</h3>
            <p className="text-sm opacity-90 mt-1">Get exclusive deals and latest updates delivered to your inbox</p>
          </div>
          <div className="flex w-full md:w-auto rounded-2xl overflow-hidden shadow-card">
            <input
              type="email"
              placeholder="Enter your email address"
              className="px-4 py-3 text-sm text-gray-800 w-full md:w-72 focus:outline-none"
            />
            <button type="button" className="bg-gray-900 text-white px-6 py-3 font-bold text-sm hover:bg-gray-800 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="page-container py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-black tracking-tight">
            <span className="text-gray-300">Shop</span>
            <span className="text-brand-500">Hub</span>
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Pakistan&apos;s #1 Online Shopping Destination. Find everything from electronics, fashion, home essentials, sports gear, books and toys at unbeatable prices.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map((Icon, i) => (
              <button
                key={i}
                type="button"
                aria-label="Social link"
                className="w-8 h-8 bg-white/10 hover:bg-brand-500 rounded-full flex items-center justify-center transition-colors"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/products" className="hover:text-brand-500 transition-colors">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-brand-500 transition-colors">Shopping Cart</Link></li>
            <li><Link to="/login" className="hover:text-brand-500 transition-colors">My Account</Link></li>
            <li><Link to="/dashboard" className="hover:text-brand-500 transition-colors">Track Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Customer Service</h4>
          <ul className="space-y-2.5 text-xs">
            <li><span className="hover:text-brand-500 cursor-pointer transition-colors">Help Center</span></li>
            <li><span className="hover:text-brand-500 cursor-pointer transition-colors">Shipping & Delivery</span></li>
            <li><span className="hover:text-brand-500 cursor-pointer transition-colors">Returns & Refunds</span></li>
            <li><span className="hover:text-brand-500 cursor-pointer transition-colors">Terms & Conditions</span></li>
            <li><span className="hover:text-brand-500 cursor-pointer transition-colors">Privacy Policy</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2">
              <FiMapPin className="text-brand-500 mt-0.5 flex-shrink-0" size={14} />
              <span>NovaCart Tower, Main Boulevard, Lahore, Pakistan</span>
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-brand-500 flex-shrink-0" size={14} />
              <span>+92 300 1234567</span>
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-brand-500 flex-shrink-0" size={14} />
              <span>support@shophub.pk</span>
            </li>
          </ul>

          <div className="mt-5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Payment Methods</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {['VISA', 'MasterCard', 'JazzCash', 'EasyPaisa', 'COD'].map((m) => (
                <span key={m} className="bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} NovaCart Pakistan. All rights reserved.</span>
          <span className="text-gray-600">Built with React, Express & MongoDB</span>
        </div>
      </div>
    </footer>
  );
}
