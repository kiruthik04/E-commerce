import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';

const CategoryTree = ({ categories, selectedCategoryId, onSelectCategory }) => {
    const [expanded, setExpanded] = useState({});

    const toggle = (id, e) => {
        e.stopPropagation();
        setExpanded(p => ({ ...p, [id]: !p[id] }));
    };

    const renderNode = (cat, depth = 0) => {
        const hasChildren = cat.subCategories?.length > 0;
        const isExpanded = expanded[cat.id];
        const isSelected = selectedCategoryId === cat.id;

        return (
            <div key={cat.id}>
                <div
                    onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 select-none text-sm
            ${isSelected
                            ? 'bg-brand-600 text-white font-semibold shadow-sm shadow-brand-500/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    style={{ paddingLeft: `${(depth * 16) + 12}px` }}
                >
                    {hasChildren ? (
                        <button
                            onClick={e => toggle(cat.id, e)}
                            className={`shrink-0 transition-all duration-150 ${isSelected ? 'text-white/80' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    ) : (
                        <span className="w-4 shrink-0" />
                    )}
                    {isExpanded
                        ? <FolderOpen size={15} className={`shrink-0 ${isSelected ? 'text-white/90' : 'text-brand-400'}`} />
                        : <Folder size={15} className={`shrink-0 ${isSelected ? 'text-white/90' : 'text-slate-400'}`} />
                    }
                    <span className="truncate">{cat.name}</span>
                </div>

                {hasChildren && isExpanded && (
                    <div>{cat.subCategories.map(c => renderNode(c, depth + 1))}</div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-0.5 scrollbar-thin overflow-y-auto max-h-72 pr-1">
            {categories.map(c => renderNode(c))}
        </div>
    );
};

export default CategoryTree;
