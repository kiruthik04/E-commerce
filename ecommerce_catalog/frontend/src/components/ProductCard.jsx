import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const ratingStars = (count = 4) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={12} className={i < count ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'} />
));

const ProductCard = ({ product }) => {
    const img = product.images?.find(i => i.isPrimary)?.imageUrl
        || product.images?.[0]?.imageUrl
        || `https://placehold.co/400x400?text=${encodeURIComponent(product.name?.[0] || 'P')}`;

    const hasDiscount = !!product.discountPrice;
    const discountPct = hasDiscount
        ? Math.round((1 - product.discountPrice / product.price) * 100)
        : null;

    return (
        <Link
            to={`/product/${product.id}`}
            className="group card flex flex-col overflow-hidden hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center p-4">
                <img
                    src={img}
                    alt={product.name}
                    className="h-full w-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
                />

                {hasDiscount && (
                    <span className="absolute top-3 left-3 badge badge-brand bg-brand-600 text-white border-brand-700 text-[11px] shadow">
                        −{discountPct}%
                    </span>
                )}

                {product.stockQty === 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="badge badge-danger text-sm shadow">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2 p-5 flex-1">
                {product.categoryName && (
                    <span className="text-[11px] font-bold text-brand-500 uppercase tracking-widest">{product.categoryName}</span>
                )}

                <h3 className="font-display font-semibold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1 mt-0.5">
                    {ratingStars(4)}
                    <span className="text-xs text-slate-400 ml-1">4.0</span>
                </div>

                <div className="flex items-end justify-between mt-auto pt-3 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-display font-bold text-slate-900">
                            ${(hasDiscount ? product.discountPrice : product.price).toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-slate-400 line-through">${product.price.toFixed(2)}</span>
                        )}
                    </div>
                    <div className="p-2 rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-200">
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
