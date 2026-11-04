import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { APP_ENV } from "@/config/env";
import { useDynamicLabel } from "@/hooks/useDynamicLabel";
import { useTenant } from "@/hooks/useTenant";
import { MODULE_REGISTRY } from "@/router/ModuleRegistry";
import { ROLE_LABELS } from "@/types/tenant";
import { cn } from "@/utils/cn";
import {
  getAllowedModules,
  getTenantBasePath,
  humanize,
} from "@/utils/tenant";

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { tenant, role } = useTenant();
  const label = useDynamicLabel();

  if (!tenant) {
    return null;
  }

  const modules = getAllowedModules(tenant, role);
  const basePath = getTenantBasePath(tenant);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/20 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Navegación principal"
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded border border-gray-300 bg-gray-100 text-sm font-semibold text-gray-700">
              {tenant.logo_url ? (
                <img
                  src={tenant.logo_url}
                  alt={tenant.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                tenant.name.charAt(0).toUpperCase()
              )}
            </span>
            <p className="truncate text-sm font-semibold text-gray-900">
              {tenant.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-2 pb-2 text-[11px] uppercase tracking-wide text-gray-400">
            Módulos
          </p>
          <nav className="space-y-1">
            {modules.map((module) => {
              const definition = MODULE_REGISTRY[module];
              const Icon = definition.icon;

              return (
                <NavLink
                  key={module}
                  to={`${basePath}/${module}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-gray-100 font-medium text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0 text-gray-500" />
                  <span className="truncate">
                    {label(definition.labelKey, humanize(module))}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-200 px-5 py-4">
          <p className="text-xs text-gray-500">
            Rol: <span className="font-medium text-gray-700">{ROLE_LABELS[role]}</span>
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            {APP_ENV.appName}
          </p>
        </div>
      </aside>
    </>
  );
}
