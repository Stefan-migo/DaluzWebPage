"use client";

import { Card, CardContent } from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-brand-primary/10 rounded animate-pulse" />
          <div className="h-5 w-72 bg-brand-primary/10 rounded animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-brand-primary/10 rounded animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Skeleton */}
        <div className="lg:col-span-1">
          <Card
            variant="brand-subtle"
            className="shadow-alkimya overflow-hidden"
          >
            <CardContent className="p-6 bg-bg-light">
              <div className="space-y-5">
                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-brand-primary/10 animate-pulse" />
                </div>

                {/* Name & Email */}
                <div className="text-center space-y-2">
                  <div className="h-6 w-40 mx-auto bg-brand-primary/10 rounded animate-pulse" />
                  <div className="h-4 w-48 mx-auto bg-brand-primary/10 rounded animate-pulse" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <div className="h-6 w-28 bg-brand-primary/10 rounded-full animate-pulse" />
                  <div className="h-6 w-24 bg-brand-primary/10 rounded-full animate-pulse" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-primary/20">
                  <div className="text-center space-y-1">
                    <div className="h-8 w-8 mx-auto bg-brand-primary/10 rounded animate-pulse" />
                    <div className="h-3 w-12 mx-auto bg-brand-primary/10 rounded animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <div className="h-8 w-8 mx-auto bg-brand-primary/10 rounded animate-pulse" />
                    <div className="h-3 w-16 mx-auto bg-brand-primary/10 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form Skeleton */}
        <div className="lg:col-span-2">
          <Card
            variant="brand-subtle"
            className="shadow-alkimya overflow-hidden"
          >
            <CardContent className="bg-bg-light p-6">
              <div className="space-y-8">
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <div className="h-5 w-44 bg-brand-primary/10 rounded animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-brand-primary/10 rounded animate-pulse" />
                      <div className="h-10 bg-brand-primary/10 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-brand-primary/10 rounded animate-pulse" />
                      <div className="h-10 bg-brand-primary/10 rounded animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact */}
                <div className="space-y-4 pt-4 border-t border-brand-primary/20">
                  <div className="h-5 w-52 bg-brand-primary/10 rounded animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-12 bg-brand-primary/10 rounded animate-pulse" />
                      <div className="h-10 bg-brand-primary/10 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-brand-primary/10 rounded animate-pulse" />
                      <div className="h-10 bg-brand-primary/10 rounded animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Personal Details */}
                <div className="space-y-4 pt-4 border-t border-brand-primary/20">
                  <div className="h-5 w-48 bg-brand-primary/10 rounded animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-36 bg-brand-primary/10 rounded animate-pulse" />
                      <div className="h-10 bg-brand-primary/10 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-brand-primary/10 rounded animate-pulse" />
                      <div className="h-10 bg-brand-primary/10 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
