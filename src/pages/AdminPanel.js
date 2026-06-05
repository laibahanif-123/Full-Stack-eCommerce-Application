// client/src/pages/AdminPanel.js
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/store';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSettings, FiSearch, FiX, FiLayers, FiDollarSign, FiInbox } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys', 'Clothes', 'Makeup'];

const formatRs = (amount) => `Rs. ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function AdminPanel() {
  const { products, fetchProducts, createProduct, updateProduct, deleteProduct, loading } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    image: '',
    description: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      category: 'Electronics',
      image: '',
      description: '',
      stock: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      stock: product.stock
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.image || !formData.description || !formData.stock) {
      return toast.error('Please complete all form fields.');
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10)
    };

    if (isNaN(payload.price) || payload.price < 0) {
      return toast.error('Price must be a valid non-negative number.');
    }
    if (isNaN(payload.stock) || payload.stock < 0) {
      return toast.error('Stock must be a valid non-negative integer.');
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success('Product updated successfully!');
      } else {
        await createProduct(payload);
        toast.success('Product created successfully!');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;

    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stockValuation = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="page-container py-6 md:py-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <FiSettings className="text-brand-500 animate-spin-slow" /> Admin Dashboard
          </h1>
          <p className="text-gray-500 text-xs font-medium">Manage catalog inventory, metrics, and stock counts.</p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 btn-primary px-5 py-3 rounded-xl text-sm self-start shadow-sm"
        >
          <FiPlus /> Add Product
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dash-card flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-brand-500 border border-orange-100 rounded-xl"><FiLayers size={22} /></div>
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Products</h4>
            <p className="dash-stat mt-1">{products.length}</p>
          </div>
        </div>
        <div className="dash-card flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl"><FiDollarSign size={22} /></div>
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock Valuation</h4>
            <p className="dash-stat mt-1 text-base md:text-2xl">{formatRs(stockValuation)}</p>
          </div>
        </div>
        <div className="dash-card flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl"><FiInbox size={22} /></div>
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Out of Stock</h4>
            <p className="dash-stat mt-1">{products.filter(p => p.stock === 0).length}</p>
          </div>
        </div>
      </section>

      <section className="dash-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search catalog items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 input-field py-2.5"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </section>

      <section className="dash-card p-0 overflow-hidden">
        {loading && filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
            <p className="text-xs text-gray-500 mt-2">Loading inventory...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No products found. Add a product to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                        />
                        <div className="max-w-[200px] sm:max-w-xs">
                          <h4 className="font-bold text-gray-900 truncate" title={product.name}>{product.name}</h4>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-md">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-500">
                      {formatRs(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                        product.stock === 0
                          ? 'text-red-600 bg-red-50 border-red-100'
                          : product.stock < 10
                          ? 'text-amber-600 bg-amber-50 border-amber-100'
                          : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 text-brand-500 hover:bg-orange-50 border border-orange-100 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-500 hover:bg-red-50 border border-red-100 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-gray-100 rounded-2xl max-w-lg w-full shadow-card-hover overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            <header className="flex justify-between items-center px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <FiX size={18} />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. NovaCart Smart Watch" className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Price (Rs.)</label>
                  <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleInputChange} placeholder="1999" className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock</label>
                  <input type="number" name="stock" required value={formData.stock} onChange={handleInputChange} placeholder="25" className="input-field" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>
                <select name="category" required value={formData.category} onChange={handleInputChange} className="input-field py-2.5">
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Image URL</label>
                <input type="url" name="image" required value={formData.image} onChange={handleInputChange} placeholder="https://images.unsplash.com/..." className="input-field" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                <textarea name="description" required rows={3} value={formData.description} onChange={handleInputChange} placeholder="Product description..." className="input-field resize-none" />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold">
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
