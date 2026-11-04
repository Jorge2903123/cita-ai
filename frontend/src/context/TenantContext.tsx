import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { fetchBootstrap } from "@/api/bootstrap";
import { setApiContext } from "@/api/runtime";
import { APP_ENV } from "@/config/env";
import type {
  BootstrapResponse,
  TenantConfig,
  UserRole,
} from "@/types/tenant";
import { TenantNotFoundError } from "@/utils/errors";
import {
  applyTenantTheme,
  isAuthRoute,
  resolveTenantId,
} from "@/utils/tenant";
import { useAuth } from "@/hooks/useAuth";

export type TenantStatus = "idle" | "loading" | "success" | "error";

export interface TenantContextValue {
  tenantId: string | null;
  tenant: TenantConfig | null;
  role: UserRole;
  isAuthenticated: boolean;
  status: TenantStatus;
  error: Error | null;
  refetch: () => void;
}

export const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { session, hydrateSession, canHydrateFromBootstrap } = useAuth();
  const tenantId =
    resolveTenantId(location) || APP_ENV.defaultTenant || null;
  const isAuthPage = isAuthRoute(location.pathname);

  const bootstrapQuery = useQuery<BootstrapResponse, Error>({
    queryKey: ["tenant-bootstrap", tenantId],
    queryFn: async () => {
      if (!tenantId) {
        throw new TenantNotFoundError("desconocido");
      }

      const response = await fetchBootstrap(tenantId, {
        token: session?.access_token ?? null,
      });

      if (response.session) {
        setApiContext({
          tenantId,
          token: response.session.access_token,
        });
      }

      return response;
    },
    enabled: Boolean(tenantId) && !isAuthPage,
    staleTime: 5 * 60_000,
    retry: (failureCount, error) =>
      !(error instanceof TenantNotFoundError) && failureCount < 2,
  });

  const bootstrapSession = bootstrapQuery.data?.session;
  const effectiveSession =
    session ?? (canHydrateFromBootstrap ? bootstrapSession : null);

  useEffect(() => {
    if (bootstrapSession) {
      hydrateSession(bootstrapSession);
    }
  }, [bootstrapSession, hydrateSession]);

  const tenant = bootstrapQuery.data?.tenant ?? null;

  useEffect(() => {
    if (tenant) {
      applyTenantTheme(tenant.theme);
    }
  }, [tenant]);

  useEffect(() => {
    setApiContext({
      tenantId,
      token: session?.access_token ?? null,
    });
  }, [tenantId, session?.access_token]);

  const role: UserRole = effectiveSession?.user.role ?? "customer";

  const status: TenantStatus = isAuthPage
    ? "idle"
    : !tenantId
      ? "error"
      : bootstrapQuery.isLoading
        ? "loading"
        : bootstrapQuery.isError
          ? "error"
          : tenant
            ? "success"
            : "idle";

  const error =
    bootstrapQuery.error ??
    (!tenantId && !isAuthPage
      ? new TenantNotFoundError("desconocido")
      : null);

  const value = useMemo<TenantContextValue>(
    () => ({
      tenantId,
      tenant,
      role,
      isAuthenticated: Boolean(effectiveSession),
      status,
      error,
      refetch: () => {
        void bootstrapQuery.refetch();
      },
    }),
    [tenantId, tenant, role, effectiveSession, status, error, bootstrapQuery],
  );

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}
