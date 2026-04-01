"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: "table" | "grid" | "card" | "list";
  count?: number;
  className?: string;
}

// Table skeleton for admin tables
function TableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Card className="bg-admin-bg-secondary admin-card">
      <CardHeader>
        <Skeleton className="h-8 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`header-${i}`} className="h-4 w-full" />
            ))}
          </div>

          {/* Table Rows */}
          {[...Array(count)].map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="grid grid-cols-5 gap-4 py-3 border-t"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Grid skeleton for product cards
function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Card skeleton for stats
function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="ml-4 space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// List skeleton for simple lists
function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 border rounded-lg"
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function LoadingSkeleton({
  type = "table",
  count,
  className = "",
}: LoadingSkeletonProps) {
  const defaultCounts: Record<string, number> = {
    table: 5,
    grid: 8,
    card: 4,
    list: 5,
  };

  const itemCount = count ?? defaultCounts[type] ?? 5;

  return (
    <div className={className}>
      {type === "table" && <TableSkeleton count={itemCount} />}
      {type === "grid" && <GridSkeleton count={itemCount} />}
      {type === "card" && <CardSkeleton count={itemCount} />}
      {type === "list" && <ListSkeleton count={itemCount} />}
    </div>
  );
}
