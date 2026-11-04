import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/70",
        className,
      )}
    />
  );
}

export type SkeletonVariant = "app" | "table" | "cards";

export function SkeletonLoader({ variant = "app" }: { variant?: SkeletonVariant }) {
  if (variant === "table") {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <Skeleton className="mb-4 h-8 w-full" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`row-${index}`}
              className="flex items-center gap-4 border-t border-slate-100 py-3"
            >
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="hidden h-4 w-32 sm:block" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`card-${index}`}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <Skeleton className="mt-6 h-9 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-5 lg:block">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="mt-8 space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`nav-${index}`} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div className="space-y-5 p-6">
          <Skeleton className="h-8 w-56" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`stat-${index}`}
                className="h-28 rounded-2xl"
              />
            ))}
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
