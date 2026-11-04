import { Navigate, Route, Routes } from "react-router-dom";
import { NotFoundView } from "@/components/feedback/NotFoundView";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useTenant } from "@/hooks/useTenant";
import LoginView from "@/modules/auth/LoginView";
import { getAllowedModules, getModulePath } from "@/utils/tenant";
import { ModuleOutlet, ModulesEmptyState } from "./ModuleOutlet";
import { RequireAuth, TenantGate } from "./guards";

function ModuleIndexRedirect() {
  const { tenant, role } = useTenant();

  if (!tenant) {
    return null;
  }

  const [firstModule] = getAllowedModules(tenant, role);

  if (!firstModule) {
    return <ModulesEmptyState />;
  }

  return <Navigate to={getModulePath(tenant, firstModule)} replace />;
}

function DashboardShell() {
  return (
    <TenantGate>
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    </TenantGate>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/t/:tenantId" element={<DashboardShell />}>
        <Route index element={<ModuleIndexRedirect />} />
        <Route path=":moduleSlug" element={<ModuleOutlet />} />
      </Route>
      <Route path="/" element={<DashboardShell />}>
        <Route index element={<ModuleIndexRedirect />} />
        <Route path=":moduleSlug" element={<ModuleOutlet />} />
      </Route>
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
}
