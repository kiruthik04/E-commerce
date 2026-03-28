import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i);

    const btnClass = (active) =>
        `min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-150 ${active
            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200'
        }`;

    return (
        <div className="flex items-center justify-center gap-1.5">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`${btnClass(false)} disabled:opacity-40 disabled:cursor-not-allowed px-3`}
            >
                <ChevronLeft size={16} />
            </button>

            {pages.map(p => (
                <button key={p} onClick={() => onPageChange(p)} className={btnClass(p === currentPage)}>
                    {p + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`${btnClass(false)} disabled:opacity-40 disabled:cursor-not-allowed px-3`}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;
