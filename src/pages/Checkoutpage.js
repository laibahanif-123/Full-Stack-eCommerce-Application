// client/src/pages/Checkoutpage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/store';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiArrowLeft, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';

export default function CheckoutPage() {
  const { cart, checkout, loading } = useStore();
  const navigate = useNavigate();
  const step = 1;
  const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'Pakistan' });

  const handleChange = (e) => setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      return toast.error('Please fill in all address fields');
    }
    try {
      const order = await checkout(shippingAddress);
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  if (!cart || cart.length === 0) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-lg p-12 max-w-md mx-auto border border-gray-100">
        <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
        <p className="text-sm text-gray-400 mb-6">Add products before checkout</p>
        <Link to="/products" className="btn-primary px-8 py-3 rounded-lg text-sm inline-block">Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="page-container py-4 space-y-4">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-500 font-medium">
        <FiArrowLeft size={14} /> Back to Cart
      </Link>

      {/* Progress Steps */}
      <div className="card p-4">
        <div className="flex items-center justify-center gap-2 md:gap-8">
          {['Shipping Address', 'Payment', 'Confirmation'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i + 1 <= step ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>{i + 1}</div>
              <span className={`text-sm font-medium hidden sm:inline ${i + 1 <= step ? 'text-brand-500' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <div className={`w-8 md:w-16 h-0.5 ${i + 1 < step ? 'bg-brand-500' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          {/* Shipping Address */}
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2"><FiMapPin className="text-brand-500" /> Shipping Address</h2>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Street Address</label>
              <input type="text" name="street" required value={shippingAddress.street} onChange={handleChange} placeholder="House #, Street, Area"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 text-gray-700" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">City</label>
                <input type="text" name="city" required value={shippingAddress.city} onChange={handleChange} placeholder="Lahore"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 text-gray-700" /></div>
              <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Province</label>
                <input type="text" name="state" required value={shippingAddress.state} onChange={handleChange} placeholder="Punjab"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 text-gray-700" /></div>
              <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Zip Code</label>
                <input type="text" name="zipCode" required value={shippingAddress.zipCode} onChange={handleChange} placeholder="54000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 text-gray-700" /></div>
            </div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Country</label>
              <input type="text" name="country" required value={shippingAddress.country} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 text-gray-700 bg-gray-50" /></div>
          </div>

          {/* Payment */}
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2"><FiCreditCard className="text-brand-500" /> Payment Method</h2>
            <div className="border-2 border-brand-500 bg-brand-50 rounded-lg p-4 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-brand-500"></div></div>
              <div><h4 className="text-sm font-semibold text-gray-800">Cash on Delivery (COD)</h4><p className="text-xs text-gray-500 mt-0.5">Pay when you receive your order</p></div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 opacity-50">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              <div><h4 className="text-sm font-medium text-gray-500">Online Payment</h4><p className="text-xs text-gray-400 mt-0.5">Credit/Debit Card, JazzCash, EasyPaisa (Coming Soon)</p></div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-primary py-4 rounded-lg text-sm flex items-center justify-center gap-2">
            {loading ? 'Processing Order...' : `Place Order — Rs. ${total.toLocaleString()}`}
          </button>
        </form>

        {/* Order Summary */}
        <aside className="space-y-4">
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-3 text-sm">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-gray-800 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 flex-shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold">Rs. {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span>
                {shippingCost === 0 ? <span className="text-green-600 font-semibold">FREE</span> : <span>Rs. {shippingCost}</span>}
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between"><span className="font-bold text-gray-800">Total</span><span className="text-xl font-bold text-brand-500">Rs. {total.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-2 text-sm text-green-700">
            <FiCheckCircle className="flex-shrink-0" /> <span className="text-xs">Your order is protected by NovaCart Buyer Protection</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
