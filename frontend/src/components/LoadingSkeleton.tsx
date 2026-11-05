import React from 'react';

interface SkeletonGridProps {
  count?: number;
}

export const BusinessCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-neutral-200 p-5 animate-pulse flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-16 h-16 rounded-xl bg-neutral-200 shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-4 bg-neutral-100 rounded-md w-16"></div>
        <div className="h-4 bg-neutral-100 rounded-md w-20"></div>
      </div>
      <div className="space-y-1.5 mb-4">
        <div className="h-3 bg-neutral-100 rounded w-full"></div>
        <div className="h-3 bg-neutral-100 rounded w-5/6"></div>
      </div>
    </div>
    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
      <div className="h-7 bg-neutral-200 rounded-lg w-20"></div>
      <div className="h-7 bg-neutral-100 rounded-lg w-16"></div>
    </div>
  </div>
);

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <BusinessCardSkeleton key={i} />
      ))}
    </div>
  );
};

