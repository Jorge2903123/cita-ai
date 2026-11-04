import { Building2, Home, RefreshCcw } from "lucide-react";
import { APP_ENV } from "@/config/env";
import { Button } from "@/components/ui/Button";

export interface TenantNotFoundProps {
  tenantId?: string | null;
  onRetry?: () => void;
}

export function TenantNotFound({ tenantId, onRetry }: TenantNotFoundProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
          <Building2 className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-slate-900">
          No encontramos este negocio
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {tenantId
            ? `El espacio de trabajo "${tenantId}" no existe o fue desactivado.`
            : "La URL no incluye un negocio válido."}{" "}
          Revisa el enlace o solicita acceso a tu administrador.
        </p>
        <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Formatos válidos
          </p>
          <code className="mt-1 block text-xs text-slate-600">
            /t/barberia-elite/appointments
          </code>
          <code className="mt-1 block text-xs text-slate-600">
            /?tenant=barberia-elite
          </code>
        </div>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {onRetry ? (
            <Button
              variant="outline"
              leftIcon={<RefreshCcw className="h-4 w-4" />}
              onClick={onRetry}
            >
              Reintentar
            </Button>
          ) : null}
          <Button
            leftIcon={<Home className="h-4 w-4" />}
            onClick={() => {
              window.location.assign("/");
            }}
          >
            Ir al inicio
          </Button>
        </div>
        <p className="mt-5 text-[11px] uppercase tracking-widest text-slate-300">
          {APP_ENV.appName}
        </p>
      </div>
    </div>
  );
}
