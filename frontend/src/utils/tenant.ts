import type { Location } from "react-router-dom";
import {
  DEFAULT_LABELS,
  MODULE_SLUGS,
  USER_ROLES,
  type ModuleSlug,
  type TenantConfig,
  type TenantLabels,
  type TenantTheme,
  type UserRole,
} from "@/types/tenant";

const DEFAULT_THEME: TenantTheme = {
  primary: "#4f46e5",
  secondary: "#0f172a",
  on_primary: "#ffffff",
};

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.some((role) => role === value);
}

export function isModuleSlug(value: string): value is ModuleSlug {
  return MODULE_SLUGS.some((module) => module === value);
}

export function resolveTenantId(location: Location): string | null {
  const pathMatch = /^\/t\/([^/]+)/.exec(location.pathname);
  if (pathMatch?.[1]) {
    return decodeURIComponent(pathMatch[1]);
  }

  const queryTenant = new URLSearchParams(location.search).get("tenant");
  if (queryTenant) {
    return queryTenant;
  }

  return null;
}

export function getTenantSlug(tenant: TenantConfig): string {
  return tenant.slug ?? tenant.tenant_id;
}

export function getTenantBasePath(tenant: TenantConfig): string {
  return `/t/${encodeURIComponent(getTenantSlug(tenant))}`;
}

export function getModulePath(
  tenant: TenantConfig,
  module: ModuleSlug,
): string {
  return `${getTenantBasePath(tenant)}/${module}`;
}

export function isModuleEnabled(
  tenant: TenantConfig,
  module: ModuleSlug,
): boolean {
  return tenant.modules.includes(module);
}

export function getAllowedModules(
  tenant: TenantConfig,
  role: UserRole,
): ModuleSlug[] {
  const permission = tenant.role_permissions[role];

  if (!permission) {
    return tenant.modules;
  }

  return tenant.modules.filter((module) =>
    permission.modules.includes(module),
  );
}

export function canAccessModule(
  tenant: TenantConfig,
  role: UserRole,
  module: ModuleSlug,
): boolean {
  return isModuleEnabled(tenant, module) && getAllowedModules(tenant, role).includes(module);
}

export function resolveLabel(
  labels: TenantLabels | undefined,
  key: string,
  fallback?: string,
): string {
  const custom = labels?.[key];
  if (custom) {
    return custom;
  }

  if (key in DEFAULT_LABELS) {
    return DEFAULT_LABELS[key as keyof typeof DEFAULT_LABELS];
  }

  return fallback ?? humanize(key);
}

export function humanize(value: string): string {
  const normalized = value.replace(/[_-]+/g, " ").trim();
  if (!normalized) {
    return value;
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function applyTenantTheme(theme: TenantTheme | undefined): void {
  const root = document.documentElement;
  const safeTheme = theme ?? DEFAULT_THEME;
  const foreground = safeTheme.on_primary ?? "#ffffff";

  root.style.setProperty("--tenant-primary", safeTheme.primary);
  root.style.setProperty("--tenant-primary-foreground", foreground);
  root.style.setProperty(
    "--tenant-primary-soft",
    `color-mix(in srgb, ${safeTheme.primary} 11%, white)`,
  );
  root.style.setProperty("--tenant-secondary", safeTheme.secondary);

  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute("content", safeTheme.primary);
}

export function isAuthRoute(pathname: string): boolean {
  return pathname === "/login";
}
