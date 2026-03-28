import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';
import ProductForm from '../components/ProductForm';
import Pagination from '../components/Pagination';

const AdminProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);

    const [editingProduct, setEditingProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        fetchProducts(0);
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            if (res.data.success) {
                setCategories(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const fetchProducts = async (page) => {
        setLoading(true);
        try {
            const res = await api.get('/products', { params: { page, size: 10 } });
            if (res.data.success) {
                setProducts(res.data.data.content);
                setPagination({
                    page: res.data.data.pageable.pageNumber,
                    totalPages: res.data.data.totalPages
                });
            }
        } catch (err) {
            console.error('Failed to load products', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts(pagination.page);
        } catch (err) {
            console.error(err);
            alert('Failed to delete product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleFormSave = () => {
        setIsFormOpen(false);
        fetchProducts(pagination.page);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                >
                    <Plus size={18} /> New Product
                </button>
            </div>

            {isFormOpen ? (
                <div className="p-6 md:p-10 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">
                        {editingProduct ? 'Edit Product' : 'Create New Product'}
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <ProductForm
                            product={editingProduct}
                            categories={categories}
                            onSave={handleFormSave}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </div>
            ) : null}

            <div className="overflow-x-auto p-0">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold text-right">Price</th>
                            <th className="p-4 font-semibold text-center">Stock</th>
                            <th className="p-4 font-semibold text-center">Status</th>
                            <th className="p-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500">No products found.</td></tr>
                        ) : products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-sm text-gray-500">#{product.id}</td>
                                <td className="p-4 text-gray-900 font-medium">
                                    <div className="flex items-center gap-3">
                                        {product.images?.[0]?.imageUrl && (
                                            <img src={product.images[0].imageUrl} alt="thumb" className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                                        )}
                                        <span className="truncate max-w-[200px]" title={product.name}>{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600">{product.categoryName}</td>
                                <td className="p-4 text-right font-medium text-gray-900">
                                    ${product.price ? product.price.toFixed(2) : '0.00'}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.stockQty > 10 ? 'bg-green-100 text-green-800' :
                                        product.stockQty > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.stockQty}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    {product.status === 'ACTIVE' ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                                            <CheckCircle size={16} /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-500 text-sm font-medium">
                                            <XCircle size={16} /> {product.status}
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => fetchProducts(page)}
                />
            </div>
        </div>
    );
};

export default AdminProductPage;
