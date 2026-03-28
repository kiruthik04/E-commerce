import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import api from '../api/axios';

const ratingStars = (count = 4) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={16} className={i < count ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'} />
));

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/products/${id}`);
            if (res.data.success) {
                const p = res.data.data;
                setProduct(p);
                const primary = p.images?.find(i => i.isPrimary)?.imageUrl || p.images?.[0]?.imageUrl || '';
                setSelectedImage(primary);
                if (p.variants?.length) setSelectedVariant(p.variants[0]);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Product not found');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
            <div className="skeleton aspect-square rounded-3xl" />
            <div className="space-y-5 pt-6">
                <div className="skeleton h-4 w-1/4 rounded" />
                <div className="skeleton h-8 w-3/4 rounded" />
                <div className="skeleton h-6 w-1/3 rounded" />
                <div className="skeleton h-24 w-full rounded mt-4" />
                <div className="skeleton h-14 w-full rounded mt-8" />
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="card max-w-md mx-auto mt-20 p-12 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 text-2xl font-bold">!</div>
            <h3 className="font-display font-bold text-slate-900 text-xl">{error || 'Not Found'}</h3>
            <Link to="/" className="btn-primary mt-2">Back to Catalog</Link>
        </div>
    );

    const displayPrice = selectedVariant
        ? (product.discountPrice ?? product.price) + (selectedVariant.priceModifier ?? 0)
        : (product.discountPrice ?? product.price);

    const originalPrice = selectedVariant
        ? product.price + (selectedVariant.priceModifier ?? 0)
        : product.price;

    const hasDiscount = !!product.discountPrice;
    const inStock = product.stockQty > 0;

    const features = [
        { icon: <Truck size={18} />, label: 'Free shipping over $50' },
        { icon: <RotateCcw size={18} />, label: '30-day returns' },
        { icon: <ShieldCheck size={18} />, label: '1-year warranty' },
    ];

    return (
        <div className="animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <Link to="/" className="btn-ghost mb-8 -ml-2 inline-flex items-center gap-1.5 text-sm">
                <ArrowLeft size={16} /> Back to Catalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                {/* ── Images ── */}
                <div className="space-y-4">
                    <div className="card aspect-square flex items-center justify-center p-8 overflow-hidden group relative">
                        {hasDiscount && (
                            <span className="absolute top-4 left-4 badge badge-brand bg-brand-600 text-white border-brand-700 shadow">
                                On Sale
                            </span>
                        )}
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="h-full w-full object-contain mix-blend-multiply drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-300">
                                {product.name?.[0]}
                            </div>
                        )}
                    </div>

                    {product.images?.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                            {product.images.map(img => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(img.imageUrl)}
                                    className={`shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden bg-slate-50 flex items-center justify-center p-2 transition-all duration-150
                    ${selectedImage === img.imageUrl ? 'border-brand-500 shadow-md shadow-brand-500/20' : 'border-transparent hover:border-slate-200'}`}
                                >
                                    <img src={img.imageUrl} alt="" className="object-contain w-full h-full mix-blend-multiply" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Details ── */}
                <div className="flex flex-col gap-5">
                    {/* Category + title */}
                    <div>
                        <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">{product.categoryName}</span>
                        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 mt-1 leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-0.5">{ratingStars(4)}</div>
                            <span className="text-sm text-slate-500">4.0 <span className="text-slate-400">/ 5 (84 reviews)</span></span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 py-4 border-y border-slate-100">
                        <span className="font-display font-black text-4xl text-slate-900">${displayPrice.toFixed(2)}</span>
                        {hasDiscount && (
                            <span className="text-xl text-slate-400 line-through font-medium">${originalPrice.toFixed(2)}</span>
                        )}
                        {hasDiscount && (
                            <span className="badge badge-brand ml-1">
                                Save ${(originalPrice - displayPrice).toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 leading-relaxed text-[15px]">
                        {product.description || 'Experience premium quality and modern design built for everyday use.'}
                    </p>

                    {/* Variants */}
                    {product.variants?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                {product.variants[0].variantName}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map(v => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-150
                      ${selectedVariant?.id === v.id
                                                ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                                                : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white hover:bg-slate-50'
                                            }`}
                                    >
                                        {v.variantValue}
                                        {v.priceModifier > 0 && <span className="text-xs ml-1 opacity-60">+${v.priceModifier}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stock badge */}
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 text-sm font-semibold ${inStock ? 'text-emerald-600' : 'text-rose-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {inStock ? `In Stock (${product.stockQty} available)` : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Qty + actions */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    disabled={qty <= 1}
                                    className="w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 font-bold text-lg transition-colors"
                                >−</button>
                                <span className="w-12 text-center font-bold text-slate-800">{qty}</span>
                                <button
                                    onClick={() => setQty(q => q + 1)}
                                    disabled={qty >= product.stockQty}
                                    className="w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 font-bold text-lg transition-colors"
                                >+</button>
                            </div>
                            <button disabled={!inStock} className="btn-primary flex-1 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                                <ShoppingCart size={20} />
                                {inStock ? 'Add to Cart' : 'Unavailable'}
                            </button>
                            <button className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all bg-white shadow-sm">
                                <Heart size={18} />
                            </button>
                            <button className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-brand-500 hover:border-brand-200 hover:bg-brand-50 transition-all bg-white shadow-sm">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                        {features.map(f => (
                            <div key={f.label} className="bg-slate-50 rounded-xl p-3 flex flex-col items-center gap-1.5 text-center text-xs text-slate-600 font-medium border border-slate-100">
                                <span className="text-brand-500">{f.icon}</span>
                                {f.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
