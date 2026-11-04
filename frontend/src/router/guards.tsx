import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ErrorState } from "@/components/feedback/ErrorState";
import { TenantNotFound } from "@/components/feedback/TenantNotFound";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { useTenant } from "@/hooks/useTenant";
import { TenantNotFoundError } from "@/utils/errors";
import { getTenantSlug } from "@/utils/tenant";

export function TenantGate({ children }: { children: ReactNode }) {
  const { tenant, tenantId, status, error, refetch } = useTenant();

  if (status === "loading") {
    return <SkeletonLoader variant="app" />;
  }

  if (status === "error" || !tenant) {
    if (error instanceof TenantNotFoundError || !tenantId) {
      return <TenantNotFound tenantId={tenantId} />;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <ErrorState
          title="No pudimos cargar el negocio"
          message={error?.message}
          onRetry={refetch}
        />
      </div>
    );
  }

  return <>{children}</>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { tenant, tenantId, isAuthenticated } = useTenant();
  const location = useLocation();

  if (!isAuthenticated) {
    const slug = tenant ? getTenantSlug(tenant) : tenantId;
    const redirect = encodeURIComponent(
      `${location.pathname}${location.search}`,
    );
    const target = slug
      ? `/login?tenant=${encodeURIComponent(slug)}&redirect=${redirect}`
      : "/login";

    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}
