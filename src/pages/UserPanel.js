// client/src/pages/UserPanel.js
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/store';
import { FiPackage, FiCalendar, FiX, FiMapPin } from 'react-icons/fi';

const formatRs = (amount) => `Rs. ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function UserPanel() {
  const { user, orders, fetchUserOrders, loading } = useStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'status-completed';
      case 'processing':
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  };

  return (
    <div className="page-container py-6 md:py-8 space-y-6">
      <header className="dash-card flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-500 to-orange-400 flex items-center justify-center text-3xl font-black text-white shadow-md">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="text-center md:text-left space-y-1.5 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{user?.name}</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-md">
              {user?.role === 'admin' ? 'Administrator' : 'Customer Account'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              Session Verified
            </span>
          </div>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 flex flex-col items-center md:items-start">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Orders Placed</span>
          <span className="dash-stat mt-1 text-brand-500">{orders.length}</span>
        </div>
      </header>

      <main className="space-y-4">
        <h2 className="section-title flex items-center gap-2">
          <FiPackage className="text-brand-500" /> Order History
        </h2>

        {loading && orders.length === 0 ? (
          <div className="dash-card p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
            <p className="text-xs text-gray-500 mt-3">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="dash-card p-12 text-center text-gray-500 space-y-2">
            <p className="text-sm font-medium">You haven&apos;t placed any orders yet.</p>
            <p className="text-xs text-gray-400">Browse our catalog to start shopping!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <button
                key={order._id}
                type="button"
                onClick={() => setSelectedOrder(order)}
                className="dash-card text-left hover:shadow-card-hover hover:border-brand-500/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-bold text-gray-800">
                      Order #{order._id.substring(order._id.length - 8)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><FiCalendar /> {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><FiPackage /> {order.items.reduce((sum, item) => sum + item.quantity, 0)} Items</span>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-gray-100 pt-3.5 md:pt-0">
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block font-medium">Total Amount</span>
                    <span className="text-lg font-bold text-brand-500">{formatRs(order.totalAmount)}</span>
                  </div>
                  <span className="text-xs font-bold bg-orange-50 text-brand-600 px-4 py-2 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    View Details
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-2xl max-w-2xl w-full shadow-card-hover overflow-hidden flex flex-col max-h-[90vh]">
            <header className="flex justify-between items-center px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Order Details</h3>
                <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">#{selectedOrder._id}</p>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <FiX size={18} />
              </button>
            </header>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-4 bg-surface-50 border border-gray-100 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Order Status</span>
                  <span className={`inline-block mt-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${getStatusClass(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Date Placed</span>
                  <span className="font-semibold text-gray-800 mt-1.5 block flex items-center gap-1.5">
                    <FiCalendar className="text-brand-500" /> {new Date(selectedOrder.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Purchased Items</span>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 gap-4 bg-white">
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity} &times; {formatRs(item.price)}</p>
                      </div>
                      <span className="font-bold text-gray-900">{formatRs(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Shipping Address</span>
                  <div className="bg-surface-50 border border-gray-100 p-4 rounded-xl text-xs text-gray-600">
                    <p className="flex items-start gap-1.5">
                      <FiMapPin className="text-brand-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">
                        {typeof selectedOrder.shippingAddress === 'object'
                          ? `${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.zipCode}, ${selectedOrder.shippingAddress.country}`
                          : selectedOrder.shippingAddress}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 p-5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Payment Status:</span>
                    <span className="text-gray-900 uppercase font-bold">{selectedOrder.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-orange-100 pt-2">
                    <span className="text-gray-500">Items Total:</span>
                    <span className="text-gray-900 font-bold">{formatRs(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-orange-200 pt-2">
                    <span className="text-xs font-bold text-brand-600">Total Paid:</span>
                    <span className="text-xl font-black text-brand-500">{formatRs(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
