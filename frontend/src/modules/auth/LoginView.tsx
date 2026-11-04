import { useState, type FormEvent } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { loginWithPassword } from "@/api/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { APP_ENV } from "@/config/env";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import {
  ROLE_LABELS,
  USER_ROLES,
  type UserRole,
} from "@/types/tenant";
import { toApiError } from "@/utils/errors";
import { isUserRole } from "@/utils/tenant";

function isSafeRedirect(value: string | null): value is string {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//"));
}

export default function LoginView() {
  const { session, login } = useAuth();
  const { tenantId } = useTenant();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(
    APP_ENV.useMockApi ? "demo@citaai.com" : "",
  );
  const [password, setPassword] = useState(
    APP_ENV.useMockApi ? "demo1234" : "",
  );

  const tenantSlug =
    searchParams.get("tenant") ?? tenantId ?? APP_ENV.defaultTenant;
  const redirectParam = searchParams.get("redirect");
  const destination = isSafeRedirect(redirectParam)
    ? redirectParam
    : tenantSlug
      ? `/t/${encodeURIComponent(tenantSlug)}`
      : "/";
  const roleParam = searchParams.get("role");
  const demoRole: UserRole = isUserRole(roleParam) ? roleParam : "admin";

  if (session) {
    return <Navigate to={destination} replace />;
  }

  const handleRoleChange = (role: UserRole) => {
    const next = new URLSearchParams(searchParams);
    next.set("role", role);
    setSearchParams(next, { replace: true });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const nextSession = await loginWithPassword(
        { email, password },
        tenantSlug || "barberia-elite",
      );
      login(nextSession);
      navigate(destination, { replace: true });
    } catch (caught) {
      setError(toApiError(caught).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {APP_ENV.appName}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">
          Iniciar sesión
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Workspace: {tenantSlug || "sin tenant"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@negocio.com"
            autoComplete="email"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contraseña"
            autoComplete="current-password"
            required
          />

          {APP_ENV.useMockApi ? (
            <div className="rounded border border-dashed border-gray-300 p-3">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Rol de prueba
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {USER_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={
                      demoRole === role
                        ? "rounded border border-gray-900 bg-gray-900 px-2.5 py-1 text-xs font-medium text-white"
                        : "rounded border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    }
                  >
                    {ROLE_LABELS[role]}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="text-xs text-gray-700">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
