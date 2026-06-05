// client/src/pages/OrderDetailsPage.js
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/store';
import { FiCheckCircle, FiPackage, FiMapPin, FiCalendar, FiArrowLeft, FiAlertCircle, FiClock } from 'react-icons/fi';

const formatRs = (amount) => `Rs. ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { currentOrder, fetchOrderById, loading } = useStore();

  useEffect(() => {
    fetchOrderById(id);
  }, [id, fetchOrderById]);

  if (loading) {
    return (
      <div className="page-container py-8 space-y-6 animate-pulse">
        <div className="h-10 bg-white rounded-xl w-1/3 mb-4"></div>
        <div className="h-44 bg-white rounded-2xl w-full"></div>
        <div className="h-48 bg-white rounded-2xl w-full"></div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="page-container py-12 text-center">
        <div className="bg-white border border-gray-100 rounded-3xl p-10 max-w-md mx-auto shadow-card">
          <div className="text-amber-500 mx-auto w-12 h-12 flex items-center justify-center bg-amber-50 border border-amber-200 rounded-full mb-4">
            <FiAlertCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Order Not Found</h3>
          <p className="text-gray-400 text-xs mt-2">
            Could not find the tracking details for order ID: {id}.
          </p>
          <Link to="/products" className="mt-6 btn-primary px-6 py-2.5 rounded-xl text-xs inline-block shadow-sm">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(currentOrder.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const deliveryEstimate = new Date(new Date(currentOrder.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const formattedAddress = typeof currentOrder.shippingAddress === 'object'
    ? `${currentOrder.shippingAddress.street}, ${currentOrder.shippingAddress.city}, ${currentOrder.shippingAddress.state} ${currentOrder.shippingAddress.zipCode}, ${currentOrder.shippingAddress.country}`
    : currentOrder.shippingAddress;

  const getStatusStep = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
      case 'dispatched':
        return 3;
      case 'delivered':
      case 'completed':
        return 4;
      default:
        return 1;
    }
  };

  const statusStep = getStatusStep(currentOrder.orderStatus);
  const steps = [
    { label: 'Order Placed', desc: 'Received & Confirmed' },
    { label: 'Processing', desc: 'Preparing package' },
    { label: 'Shipped', desc: 'Out for delivery' },
    { label: 'Delivered', desc: 'Arrived at destination' }
  ];

  const subtotal = currentOrder.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const shippingCost = subtotal > 2000 ? 0 : 150;

  return (
    <div className="page-container py-4 md:py-6 space-y-5">
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-brand-500 font-semibold group">
        <FiArrowLeft className="transform group-hover:-translate-x-0.5 transition-transform" /> Back to Shop
      </Link>

      {/* Success Confirmation Header */}
      <div className="card p-6 md:p-8 text-center space-y-4">
        <div className="text-emerald-500 mx-auto w-16 h-16 flex items-center justify-center bg-emerald-5 border border-emerald-100 rounded-full shadow-sm animate-fade-up">
          <FiCheckCircle size={36} />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Order Confirmed!</h1>
          <p className="text-gray-400 text-xs">Thank you for your purchase. Your order is being processed.</p>
        </div>
        <div className="inline-block bg-orange-50 border border-brand-500/10 rounded-xl px-4 py-2 text-xs font-mono text-gray-600">
          Order Reference: <span className="font-bold text-brand-500">{currentOrder._id}</span>
        </div>
      </div>

      {/* Delivery Stepper Tracker Card */}
      <div className="card p-5 md:p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <FiClock className="text-brand-500" /> Order Tracking Status
        </h2>
        
        {/* Desktop Stepper */}
        <div className="hidden sm:flex items-center justify-between py-4">
          {steps.map((s, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < statusStep;
            const isActive = stepNum === statusStep;
            return (
              <div key={index} className="flex-1 flex flex-col items-center relative text-center">
                {index < steps.length - 1 && (
                  <div className={`absolute top-4.5 left-1/2 right-[-50%] h-0.5 z-0 ${
                    stepNum < statusStep ? 'bg-emerald-500' : 'bg-gray-100'
                  }`} style={{ top: '18px' }} />
                )}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-brand-500 text-white animate-pulse-glow shadow-sm'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span className={`text-xs font-bold mt-2.5 ${isActive ? 'text-brand-500' : 'text-gray-800'}`}>{s.label}</span>
                <span className="text-[10px] text-gray-400 mt-0.5 leading-tight">{s.desc}</span>
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper */}
        <div className="sm:hidden space-y-4 py-2 pl-2">
          {steps.map((s, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < statusStep;
            const isActive = stepNum === statusStep;
            return (
              <div key={index} className="flex gap-4 relative">
                {index < steps.length - 1 && (
                  <div className={`absolute left-[17px] top-[30px] bottom-[-20px] w-0.5 ${
                    stepNum < statusStep ? 'bg-emerald-500' : 'bg-gray-100'
                  }`} />
                )}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 flex-shrink-0 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-brand-500 text-white animate-pulse-glow shadow-sm'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>
                  {isCompleted ? '✓' : stepNum}
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className={`text-xs font-bold ${isActive ? 'text-brand-500' : 'text-gray-800'}`}>{s.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{s.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta details split card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 flex gap-4 items-start">
          <div className="p-3 bg-orange-50 text-brand-500 border border-orange-100 rounded-xl"><FiCalendar size={20} /></div>
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Placed</h3>
            <p className="text-sm font-bold text-gray-800">{orderDate}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-gray-500 text-xs">Status:</span>
              <span className="text-brand-500 font-bold bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">{currentOrder.orderStatus}</span>
            </div>
          </div>
        </div>

        <div className="card p-5 flex gap-4 items-start">
          <div className="p-3 bg-green-50 text-green-600 border border-green-100 rounded-xl"><FiPackage size={20} /></div>
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Delivery</h3>
            <p className="text-sm font-bold text-gray-800">Arriving by {deliveryEstimate}</p>
            <p className="text-xs text-gray-400 mt-0.5">Dispatched via standard local logistics courier.</p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="card p-5 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <FiMapPin className="text-brand-500" /> Shipping Destination Address
        </h2>
        {currentOrder.shippingAddress ? (
          <div className="text-sm text-gray-700 leading-relaxed font-semibold pl-6">
            <p>{formattedAddress}</p>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic pl-6">No shipping location address set.</p>
        )}
      </div>

      {/* Itemized Order Breakdown */}
      <div className="card p-5 space-y-4">
        <h2 className="text-sm font-extrabold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
          <FiPackage className="text-brand-500" /> Receipt Summary
        </h2>
        
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white">
          {currentOrder.items?.map((item) => (
            <div key={item._id} className="p-4 flex gap-4 items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                  <img src={item.productId?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name || "Product Item"}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Qty: <strong className="text-gray-700 font-semibold">{item.quantity}</strong> &times; {formatRs(item.price)}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-800 flex-shrink-0">
                {formatRs(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Breakdown Table */}
        <div className="space-y-2.5 pt-2 text-xs border-t border-gray-100">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-850">{formatRs(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Shipping Fee</span>
            {shippingCost === 0 ? <span className="text-green-600 font-semibold">FREE</span> : <span className="font-semibold text-gray-850">{formatRs(shippingCost)}</span>}
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-gray-200">
            <span className="font-extrabold text-gray-700 uppercase tracking-wider">Total Amount</span>
            <span className="font-black text-2xl text-brand-500">
              {formatRs(subtotal + shippingCost)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}