// client/src/pages/CartPage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiMinus, FiPlus, FiTruck } from 'react-icons/fi';

export default function CartPage() {
  const { cart, fetchCart, updateCartQuantity, removeFromCart, loading } = useStore();
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState('');

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleQuantityAdjustment = async (productId, currentQty, stockLimit, change) => {
    const targetQty = currentQty + change;
    if (targetQty < 1) return;
    if (targetQty > stockLimit) return toast.error(`Only ${stockLimit} items available`);
    try { await updateCartQuantity(productId, targetQty); } catch { toast.error('Failed to update quantity'); }
  };

  const handleRemove = async (productId) => {
    try { await removeFromCart(productId); toast.success('Item removed from cart'); } catch { toast.error('Failed to remove item'); }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shippingCost;
  const freeShippingProgress = Math.min((subtotal / 2000) * 100, 100);

  if (loading && (!cart || cart.length === 0)) return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-1/4 mb-6"></div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-lg h-64 border border-gray-100"></div>
        <div className="w-full lg:w-80 bg-white rounded-lg h-48 border border-gray-100"></div>
      </div>
    </div>
  );

  if (!cart || cart.length === 0) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-lg p-12 max-w-md mx-auto border border-gray-100">
        <FiShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h3>
        <p className="text-sm text-gray-400 mb-6">Browse our products and find something you love!</p>
        <Link to="/products" className="btn-primary px-8 py-3 rounded-lg text-sm inline-block">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="page-container py-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h1>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Cart Items */}
        <div className="flex-1 w-full card overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-center">Unit Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Subtotal</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {cart.map((item) => (
            <div key={item.productId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
              {/* Desktop Row Layout */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-4 items-center">
                {/* Product Info */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h3>
                    <p className="text-[10px] text-brand-500 font-semibold mt-1">{item.category}</p>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="col-span-2 text-center">
                  <span className="text-sm font-semibold text-gray-700">Rs. {item.price.toLocaleString()}</span>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex justify-center">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button onClick={() => handleQuantityAdjustment(item.productId, item.quantity, item.stock, -1)} disabled={item.quantity <= 1}
                      className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"><FiMinus size={12} /></button>
                    <span className="w-10 text-center text-sm font-semibold text-gray-800 border-x border-gray-200 py-1.5">{item.quantity}</span>
                    <button onClick={() => handleQuantityAdjustment(item.productId, item.quantity, item.stock, 1)} disabled={item.quantity >= item.stock}
                      className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"><FiPlus size={12} /></button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="col-span-2 text-center">
                  <span className="text-sm font-bold text-brand-500">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>

                {/* Delete */}
                <div className="col-span-1 text-center">
                  <button onClick={() => handleRemove(item.productId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Remove">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden flex gap-3.5 p-4 items-start">
                {/* Product Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                {/* Details Column */}
                <div className="flex-grow min-w-0 space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">{item.name}</h3>
                    <button onClick={() => handleRemove(item.productId)} className="text-gray-400 hover:text-red-500 p-1 rounded" title="Remove">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-brand-500">{item.category}</p>
                  
                  <div className="flex justify-between items-center pt-1">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button onClick={() => handleQuantityAdjustment(item.productId, item.quantity, item.stock, -1)} disabled={item.quantity <= 1}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-30"><FiMinus size={10} /></button>
                      <span className="w-8 text-center text-xs font-bold text-gray-800 border-x border-gray-200 py-1">{item.quantity}</span>
                      <button onClick={() => handleQuantityAdjustment(item.productId, item.quantity, item.stock, 1)} disabled={item.quantity >= item.stock}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-30"><FiPlus size={10} /></button>
                    </div>
                    
                    {/* Price Info */}
                    <div className="text-right">
                      <span className="text-[9px] text-gray-400 block font-semibold">Subtotal</span>
                      <span className="text-sm font-bold text-brand-500">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="w-full lg:w-80 space-y-4 flex-shrink-0">
          {/* Free Shipping Progress */}
          {subtotal < 2000 && (
            <div className="card p-4">
              <div className="flex items-center gap-2 text-sm mb-2">
                <FiTruck className="text-brand-500" />
                <span className="text-gray-600">Add <strong className="text-brand-500">Rs. {(2000 - subtotal).toLocaleString()}</strong> more for free shipping</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${freeShippingProgress}%` }}></div>
              </div>
            </div>
          )}

          {/* Summary Card */}
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Order Summary</h2>

            {/* Voucher */}
            <div className="flex gap-2">
              <input type="text" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Enter voucher code"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500" />
              <button className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors">Apply</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span><span className="font-semibold text-gray-800">Rs. {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span>
                {shippingCost === 0 ? <span className="text-green-600 font-semibold">FREE</span> : <span className="font-semibold">Rs. {shippingCost}</span>}
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between"><span className="font-bold text-gray-800">Total</span><span className="text-xl font-bold text-brand-500">Rs. {total.toLocaleString()}</span></div>
            </div>

            <button onClick={() => navigate('/checkout')}
              className="w-full btn-primary py-3.5 rounded-lg text-sm flex items-center justify-center gap-2 group">
              Proceed to Checkout <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-brand-500 font-medium pt-1">
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}