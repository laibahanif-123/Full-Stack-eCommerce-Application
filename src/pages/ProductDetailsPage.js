// client/src/pages/ProductDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { toast } from 'react-hot-toast';
import { FiShoppingCart, FiArrowLeft, FiHeart, FiTruck, FiShield, FiRefreshCw, FiMinus, FiPlus } from 'react-icons/fi';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, fetchProductDetails, addToCart, toggleWishlist, isInWishlist, token, loading } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => { fetchProductDetails(id); }, [id, fetchProductDetails]);

  const handleQuantityChange = (value) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 1) setQuantity(1);
    else if (parsed > currentProduct.stock) { setQuantity(currentProduct.stock); toast.error(`Only ${currentProduct.stock} items available`); }
    else setQuantity(parsed);
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try { await addToCart(currentProduct, quantity); toast.success(`Added ${quantity} item(s) to cart!`); }
    catch (err) { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  };

  const handleBuyNow = async () => {
    setAdding(true);
    try { await addToCart(currentProduct, quantity); navigate('/cart'); }
    catch (err) { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 h-[400px] bg-gray-100 rounded-lg"></div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-6 bg-gray-100 rounded w-3/4"></div>
          <div className="h-10 bg-gray-100 rounded w-1/3"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-12 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  if (!currentProduct) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-lg p-12 max-w-md mx-auto border border-gray-100">
        <p className="text-4xl mb-4">😕</p>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h3>
        <p className="text-sm text-gray-500 mb-6">This product may have been removed or doesn't exist.</p>
        <Link to="/products" className="btn-primary px-6 py-2.5 rounded-lg text-sm inline-flex items-center gap-2"><FiArrowLeft /> Back to Shop</Link>
      </div>
    </div>
  );

  const isOutOfStock = currentProduct.stock <= 0;
  const discount = currentProduct.originalPrice > currentProduct.price ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100) : 0;

  return (
    <div className="page-container py-4 space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-brand-500">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-500">Products</Link>
        <span>/</span>
        <span className="text-gray-600">{currentProduct.category}</span>
      </div>

      {/* Product Detail Card */}
      <div className="card p-5 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="w-full md:w-2/5">
            <div className="relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
              {discount > 0 && <span className="badge-sale text-sm px-3 py-1">-{discount}%</span>}
              <img src={currentProduct.image} alt={currentProduct.name} className="w-full h-[350px] md:h-[420px] object-cover object-center" />
            </div>
          </div>

          {/* Info */}
          <div className="w-full md:w-3/5 space-y-4">
            <div>
              <span className="text-xs font-semibold text-brand-500 bg-orange-50 px-2.5 py-1 rounded">{currentProduct.category}</span>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mt-3 leading-tight">{currentProduct.name}</h1>
            </div>

            {/* Rating & Sold */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="flex text-[#FFC600]">
                  {[...Array(5)].map((_, i) => <span key={i}>{i < Math.floor(currentProduct.rating) ? '★' : '☆'}</span>)}
                </div>
                <span className="text-gray-500 text-xs ml-1">{currentProduct.rating}/5</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 text-xs">{(currentProduct.sold || 0).toLocaleString()} sold</span>
              <span className="text-gray-300">|</span>
              <button onClick={() => toggleWishlist(currentProduct)} className={`flex items-center gap-1 text-xs ${isInWishlist(currentProduct._id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                <FiHeart size={14} fill={isInWishlist(currentProduct._id) ? 'currentColor' : 'none'} />
                {isInWishlist(currentProduct._id) ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Price Box */}
            <div className="bg-[#FAFAFA] rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-brand-500">Rs. {currentProduct.price.toLocaleString()}</span>
                {currentProduct.originalPrice > currentProduct.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">Rs. {currentProduct.originalPrice.toLocaleString()}</span>
                    <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
                  </>
                )}
              </div>
              {currentProduct.price > 2000 && <p className="text-xs text-green-600 font-medium flex items-center gap-1"><FiTruck size={12} /> Free Shipping</p>}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Availability:</span>
              <span className={`text-sm font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${currentProduct.stock} available)`}
              </span>
            </div>

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"><FiMinus size={14} /></button>
                  <input type="number" value={quantity} onChange={(e) => handleQuantityChange(e.target.value)}
                    className="w-14 text-center text-sm font-semibold text-gray-800 border-x border-gray-200 py-2 focus:outline-none" />
                  <button onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= currentProduct.stock}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"><FiPlus size={14} /></button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button onClick={handleBuyNow} disabled={isOutOfStock || adding}
                className="flex-1 btn-primary py-3.5 rounded-lg text-sm flex items-center justify-center gap-2">
                Buy Now
              </button>
              <button onClick={handleAddToCart} disabled={isOutOfStock || adding}
                className="flex-1 py-3.5 rounded-lg text-sm font-bold border-2 border-brand-500 text-brand-500 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                <FiShoppingCart /> {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>

            {!token && (
              <p className="text-xs text-gray-400 text-center">
                <Link to="/login" className="text-brand-500 font-semibold hover:underline">Login</Link> to save items and checkout
              </p>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
              {[
                { icon: <FiShield />, text: 'Authentic Products' },
                { icon: <FiRefreshCw />, text: '7-Day Returns' },
                { icon: <FiTruck />, text: 'Fast Delivery' },
              ].map((g, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1">
                  <span className="text-brand-500">{g.icon}</span>
                  <span className="text-[10px] text-gray-500 font-medium">{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-gray-100">
          {['details', 'reviews', 'shipping'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'details' ? 'Product Details' : tab === 'reviews' ? 'Reviews' : 'Shipping Info'}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <h3 className="font-bold text-gray-800 text-base">Product Description</h3>
              <p>{currentProduct.description || 'No description available.'}</p>
              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-400 block">Category</span><span className="font-semibold text-gray-800">{currentProduct.category}</span></div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-400 block">Rating</span><span className="font-semibold text-gray-800">{currentProduct.rating}/5 ⭐</span></div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-400 block">Stock</span><span className="font-semibold text-gray-800">{currentProduct.stock} units</span></div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-400 block">Total Sold</span><span className="font-semibold text-gray-800">{(currentProduct.sold || 0).toLocaleString()}</span></div>
              </div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-3">💬</p>
              <p className="font-medium">No reviews yet</p>
              <p className="text-xs mt-1">Be the first to review this product</p>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3"><FiTruck className="text-brand-500 mt-0.5 flex-shrink-0" /><div><h4 className="font-semibold text-gray-800">Standard Delivery</h4><p className="text-xs text-gray-400 mt-0.5">3-5 business days. Free on orders above Rs. 2,000</p></div></div>
              <div className="flex items-start gap-3"><FiRefreshCw className="text-brand-500 mt-0.5 flex-shrink-0" /><div><h4 className="font-semibold text-gray-800">Easy Returns</h4><p className="text-xs text-gray-400 mt-0.5">7-day hassle-free return and exchange policy</p></div></div>
              <div className="flex items-start gap-3"><FiShield className="text-brand-500 mt-0.5 flex-shrink-0" /><div><h4 className="font-semibold text-gray-800">Warranty</h4><p className="text-xs text-gray-400 mt-0.5">Manufacturer warranty applicable on eligible products</p></div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}