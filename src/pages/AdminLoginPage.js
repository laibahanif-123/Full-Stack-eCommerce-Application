// client/src/pages/AdminLoginPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight, FiShield, FiAlertOctagon } from 'react-icons/fi';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, token, user, error, clearErrors, loading } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user?.role === 'admin') {
      navigate('/admin');
    } else if (token) {
      navigate('/');
    }
    return () => clearErrors();
  }, [token, user, navigate, clearErrors]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      toast.success('Admin authorized successfully!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unauthorized admin credentials.');
    }
  };

  return (
    <div className="page-container py-10 md:py-16 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <div className="w-full max-w-md card p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-600 via-brand-500 to-orange-400" />

        <div className="text-center space-y-2.5 mb-8">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-card">
            <FiShield className="text-brand-500 text-xl" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Admin Console</h2>
          <p className="text-gray-500 text-xs">Secure gateway for storefront administrators.</p>
        </div>

        <div className="mb-6 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] p-3.5 rounded-xl flex gap-2.5 items-start">
          <FiAlertOctagon className="text-brand-500 mt-0.5 flex-shrink-0" size={16} />
          <p className="leading-normal">
            <strong>Authorized Personnel Only:</strong> Access requires verified administrative role permissions.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@shophub.com"
                className="input-field-icon"
              />
              <FiMail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secret Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field-icon"
              />
              <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 rounded-xl text-sm flex items-center justify-center gap-1.5 mt-2"
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate Console'}
            {!loading && <FiArrowRight />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          <Link to="/login" className="text-gray-500 hover:text-brand-500 font-semibold hover:underline">
            &larr; Return to Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
}
