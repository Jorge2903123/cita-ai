import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { setApiContext } from "@/api/runtime";
import type { AuthSession, AuthUser } from "@/types/tenant";
import { isUserRole } from "@/utils/tenant";

const STORAGE_KEY = "citaai.auth.session";

export interface AuthContextValue {
  session: AuthSession | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  canHydrateFromBootstrap: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
  hydrateSession: (session: AuthSession) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!isRecord(value) || typeof value.access_token !== "string") {
    return false;
  }

  const user = value.user;
  return (
    isRecord(user) &&
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.tenant_id === "string" &&
    isUserRole(user.role)
  );
}

function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    return isAuthSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persistSession(session: AuthSession | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(readStoredSession);
  const [canHydrateFromBootstrap, setCanHydrateFromBootstrap] = useState(true);
  const didLogout = useRef(false);

  useEffect(() => {
    persistSession(session);
    setApiContext({ token: session?.access_token ?? null });
  }, [session]);

  const login = useCallback((nextSession: AuthSession) => {
    didLogout.current = false;
    setCanHydrateFromBootstrap(true);
    persistSession(nextSession);
    setApiContext({ token: nextSession.access_token });
    setSession(nextSession);
  }, []);

  const hydrateSession = useCallback((nextSession: AuthSession) => {
    if (didLogout.current) {
      return;
    }

    setSession((current) => current ?? nextSession);
  }, []);

  const logout = useCallback(() => {
    didLogout.current = true;
    setCanHydrateFromBootstrap(false);
    persistSession(null);
    setApiContext({ token: null });
    setSession(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener("citaai:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("citaai:unauthorized", handleUnauthorized);
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      canHydrateFromBootstrap,
      login,
      logout,
      hydrateSession,
    }),
    [session, canHydrateFromBootstrap, login, logout, hydrateSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
