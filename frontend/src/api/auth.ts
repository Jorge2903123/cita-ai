import { APP_ENV } from "@/config/env";
import type { AuthSession, UserRole } from "@/types/tenant";
import { isUserRole } from "@/utils/tenant";
import { apiClient } from "./client";
import { setApiContext } from "./runtime";

export interface LoginPayload {
  email: string;
  password: string;
}

function readDemoRole(): UserRole {
  if (typeof window === "undefined") {
    return "admin";
  }

  const role = new URLSearchParams(window.location.search).get("role");
  return isUserRole(role) ? role : "admin";
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function buildDemoSession(
  payload: LoginPayload,
  tenantId: string,
): AuthSession {
  const [localPart] = payload.email.split("@");
  const role = readDemoRole();
  const name = localPart ? localPart.replace(/[._-]+/g, " ") : "Usuario demo";

  return {
    access_token: `demo.${tenantId}.${role}`,
    user: {
      id: `demo-${role}`,
      name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()),
      email: payload.email,
      role,
      tenant_id: tenantId,
    },
  };
}

export async function loginWithPassword(
  payload: LoginPayload,
  tenantId: string,
): Promise<AuthSession> {
  if (APP_ENV.useMockApi) {
    await wait(320);
    return buildDemoSession(payload, tenantId);
  }

  setApiContext({ tenantId, token: null });

  const { data } = await apiClient.post<AuthSession>("/auth/login", payload);
  return data;
}
