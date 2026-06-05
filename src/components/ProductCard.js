// client/src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useStore } from '../store/store';

const getDiscountPercent = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

const formatSold = (sold) => {
  if (sold >= 1000) return `${(sold / 1000).toFixed(1)}k`;
  return sold;
};

export default function ProductCard({ product, showStock = false }) {
  const { toggleWishlist, isInWishlist } = useStore();
  const discount = getDiscountPercent(product.price, product.originalPrice);

  return (
    <div className="product-card group">
      {discount > 0 && (
        <span className="badge-sale">-{discount}%</span>
      )}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
        className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
          isInWishlist(product._id) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
        }`}
        aria-label="Toggle wishlist"
      >
        <FiHeart size={14} fill={isInWishlist(product._id) ? 'white' : 'none'} />
      </button>
      <Link to={`/products/${product._id}`}>
        <div className="h-48 bg-surface-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-3 space-y-2">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] hover:text-brand-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-brand-500">Rs. {product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex star-filled">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xs">{i < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({product.rating || 0})</span>
          </div>
          <span className="text-[10px] text-gray-400">{formatSold(product.sold || 0)} sold</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.price > 2000 && <span className="badge-free-shipping">Free Shipping</span>}
          {discount >= 30 && <span className="badge-discount">Hot Deal</span>}
          {showStock && (
            <span className={`text-[10px] font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
