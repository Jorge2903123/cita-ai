import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { ROLE_LABELS } from "@/types/tenant";
import { getInitials } from "@/utils/format";
import { humanize } from "@/utils/tenant";

export interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { tenant, role } = useTenant();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!tenant) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate(`/login?tenant=${encodeURIComponent(tenant.tenant_id)}`, {
      replace: true,
    });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
            {tenant.name}
          </h1>
          <p className="text-xs text-gray-500">
            {humanize(tenant.business_type)} · {ROLE_LABELS[role]}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-[11px] font-semibold text-gray-600">
              {getInitials(user?.name ?? tenant.name)}
            </span>
            <div className="min-w-0">
              <p className="max-w-[160px] truncate text-xs font-medium text-gray-900">
                {user?.name ?? "Invitado"}
              </p>
              <p className="max-w-[160px] truncate text-[11px] text-gray-500">
                {user?.email ?? "Sin sesión"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 items-center gap-1.5 rounded border border-gray-200 px-2.5 text-xs text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
