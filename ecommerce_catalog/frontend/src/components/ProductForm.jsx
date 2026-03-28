import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Save, X } from 'lucide-react';

const ProductForm = ({ product, categories, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQty: '',
        categoryId: '',
        images: [{ imageUrl: '', isPrimary: true }],
        variants: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                stockQty: product.stockQty,
                categoryId: product.categoryId,
                images: product.images?.length > 0 ? product.images : [{ imageUrl: '', isPrimary: true }],
                variants: product.variants || []
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index].imageUrl = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImage = () => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, { imageUrl: '', isPrimary: false }]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { variantName: 'Size', variantValue: '', priceModifier: 0, stock: 0 }]
        }));
    };

    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Clean up empty images
            const payload = {
                ...formData,
                images: formData.images.filter(img => img.imageUrl.trim() !== '')
            };

            let res;
            if (product && product.id) {
                res = await api.put(`/products/${product.id}`, payload);
            } else {
                res = await api.post('/products', payload);
            }

            if (res.data.success) {
                onSave();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const renderCategoryOptions = (cats, depth = 0) => {
        let options = [];
        cats.forEach(cat => {
            options.push(
                <option key={cat.id} value={cat.id}>
                    {'\u00A0'.repeat(depth * 4)}{cat.name}
                </option>
            );
            if (cat.subCategories?.length > 0) {
                options = [...options, ...renderCategoryOptions(cat.subCategories, depth + 1)];
            }
        });
        return options;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                        required
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select Category</option>
                        {renderCategoryOptions(categories)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                    <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                        required
                        type="number"
                        min="0"
                        name="stockQty"
                        value={formData.stockQty}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
            </div>

            {/* Images Manager */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Images</h3>
                {formData.images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-3 mb-3">
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={img.imageUrl}
                            onChange={(e) => handleImageChange(idx, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            hidden={formData.images.length === 1}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addImage}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    <Plus size={16} /> Add Image
                </button>
            </div>

            {/* Variants Manager */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Variants (Optional)</h3>
                {formData.variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 mb-3 items-center">
                        <div className="col-span-3">
                            <input
                                type="text"
                                placeholder="Type (e.g. Size)"
                                value={v.variantName}
                                onChange={(e) => handleVariantChange(idx, 'variantName', e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            />
                        </div>
                        <div className="col-span-3">
                            <input
                                type="text"
                                placeholder="Value (e.g. XL)"
                                value={v.variantValue}
                                onChange={(e) => handleVariantChange(idx, 'variantValue', e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            />
                        </div>
                        <div className="col-span-3">
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Price Mod (+/-)"
                                value={v.priceModifier}
                                onChange={(e) => handleVariantChange(idx, 'priceModifier', parseFloat(e.target.value))}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            />
                        </div>
                        <div className="col-span-2">
                            <input
                                type="number"
                                placeholder="Stock"
                                value={v.stock}
                                onChange={(e) => handleVariantChange(idx, 'stock', parseInt(e.target.value, 10))}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                            />
                        </div>
                        <div className="col-span-1 text-right">
                            <button
                                type="button"
                                onClick={() => removeVariant(idx)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    <Plus size={16} /> Add Variant
                </button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                        <Save size={18} />
                    )}
                    {product ? 'Update' : 'Create'} Product
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
