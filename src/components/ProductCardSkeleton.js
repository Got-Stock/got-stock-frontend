import React from "react";
import { Skeleton } from "./ui/skeleton";

// Shimmer placeholder that mirrors the storefront product card layout, so the
// grid keeps its shape while products load instead of a blank spinner.
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-transparent">
      <Skeleton className="aspect-square w-full rounded-none bg-gray-200" />
      <div className="p-3 sm:p-4">
        <Skeleton className="h-3 w-1/3 mb-2 bg-gray-200" />
        <Skeleton className="h-4 w-4/5 mb-1 bg-gray-200" />
        <Skeleton className="h-4 w-2/3 mb-3 bg-gray-200" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 bg-gray-200" />
          <Skeleton className="h-5 w-14 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 9 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
