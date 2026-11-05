import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryIcon } from './CategoryIcon';
import type { Category } from '../types';
import { ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  limit?: number;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, limit }) => {
  const displayList = limit ? categories.slice(0, limit) : categories;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
      {displayList.map((cat) => (
        <Link
          key={cat.id}
          to={`/directory?category=${cat.slug}`}
          className="bg-white hover:bg-amber-50/80 p-4 rounded-xl border border-neutral-200/90 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 group-hover:bg-amber-400 text-neutral-900 flex items-center justify-center transition-colors">
              <CategoryIcon name={cat.icon || cat.name} className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-neutral-400 group-hover:text-amber-600 bg-neutral-100 group-hover:bg-amber-100/50 px-2 py-0.5 rounded-full transition-colors">
              {cat.businesses_count ?? 0}
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-neutral-900 group-hover:text-neutral-950 line-clamp-1">
              {cat.name}
            </h3>
            {cat.description && (
              <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                {cat.description}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center text-[11px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Ver contactos</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </Link>
      ))}
    </div>
  );
};

