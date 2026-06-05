// client/src/pages/SignupPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiArrowRight, FiGift } from 'react-icons/fi';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { signup, token, error, clearErrors, loading } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/');
    return () => clearErrors();
  }, [token, navigate, clearErrors]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      await signup(formData);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] page-container py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-card min-h-[560px]">
        <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-brand-500 via-brand-600 to-orange-700 p-10 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <FiGift size={28} />
            </div>
            <h1 className="text-3xl font-black mb-3">Join NovaCart Today</h1>
            <p className="text-white/85 text-sm leading-relaxed max-w-xs">
              Create your free account and unlock exclusive deals, order tracking, and a personalized shopping experience.
            </p>
          </div>
          <p className="relative text-sm text-white/80 italic">
            &ldquo;Best prices on electronics, fashion, and home essentials in Pakistan.&rdquo;
          </p>
        </div>

        <div className="flex-1 bg-white p-8 md:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 lg:hidden text-center">
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-500 text-sm mt-1">Join NovaCart and start shopping</p>
            </div>
            <div className="hidden lg:block mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
              <p className="text-gray-500 text-sm mt-1">Fill in your details to get started</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-4 py-3 rounded-xl animate-shake">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
                <div className="relative">
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Ahmed Khan" className="input-field-icon" />
                  <FiUser className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
                <div className="relative">
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" className="input-field-icon" />
                  <FiMail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
                <div className="relative">
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" className="input-field-icon" />
                  <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                </div>
              </div>

              <p className="text-xs text-gray-400">
                By signing up, you agree to our <span className="text-brand-500 cursor-pointer">Terms</span> and <span className="text-brand-500 cursor-pointer">Privacy Policy</span>
              </p>

              <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
                {loading ? 'Creating Account...' : 'SIGN UP'} {!loading && <FiArrowRight size={16} />}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-gray-400">OR</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-medium">Google</button>
                <button type="button" className="py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-medium">Facebook</button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-brand-500 font-semibold hover:underline">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
