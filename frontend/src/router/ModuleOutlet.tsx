import { Suspense } from "react";
import { LayoutGrid, ShieldAlert } from "lucide-react";
import { useParams } from "react-router-dom";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { useTenant } from "@/hooks/useTenant";
import { canAccessModule, isModuleEnabled } from "@/utils/tenant";
import { getModuleDefinition } from "./ModuleRegistry";

function ModuleUnavailable({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-1.5 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}

export function ModuleOutlet() {
  const { moduleSlug } = useParams<{ moduleSlug: string }>();
  const { tenant, role } = useTenant();

  if (!moduleSlug) {
    return (
      <ModuleUnavailable
        title="Módulo no especificado"
        message="Selecciona una sección desde el menú lateral."
      />
    );
  }

  const definition = getModuleDefinition(moduleSlug);

  if (!definition) {
    return (
      <ModuleUnavailable
        title="Módulo no disponible"
        message="Esta sección no existe en la configuración actual del negocio."
      />
    );
  }

  if (!tenant || !isModuleEnabled(tenant, definition.slug)) {
    return (
      <ModuleUnavailable
        title="Módulo desactivado"
        message="El administrador no ha habilitado esta sección para tu negocio."
      />
    );
  }

  if (!canAccessModule(tenant, role, definition.slug)) {
    return (
      <ModuleUnavailable
        title="Sin permisos de acceso"
        message="Tu rol no tiene acceso a esta sección. Contacta al administrador."
      />
    );
  }

  const ModuleComponent = definition.component;

  return (
    <Suspense fallback={<SkeletonLoader variant="table" />}>
      <ModuleComponent />
    </Suspense>
  );
}

export function ModulesEmptyState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <LayoutGrid className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-slate-900">
          Aún no hay módulos activos
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          La configuración de este negocio todavía no incluye secciones para tu
          rol. Solicita al administrador que habilite tus accesos.
        </p>
      </div>
    </div>
  );
}
