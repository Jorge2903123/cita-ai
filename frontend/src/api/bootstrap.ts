import { APP_ENV } from "@/config/env";
import type {
  BootstrapResponse,
  RawBootstrapResponse,
} from "@/types/tenant";
import {
  ApiError,
  BootstrapFormatError,
  TenantNotFoundError,
} from "@/utils/errors";
import { fetchMockBootstrap } from "./mock/bootstrap";
import { apiClient } from "./client";
import { setApiContext } from "./runtime";

export interface FetchBootstrapOptions {
  token?: string | null;
}

function normalizeBootstrap(raw: RawBootstrapResponse): BootstrapResponse {
  const tenant = raw.tenant ?? raw.schema_config;

  if (!tenant) {
    throw new BootstrapFormatError();
  }

  const session =
    raw.session ??
    (raw.user && raw.access_token
      ? { access_token: raw.access_token, user: raw.user }
      : undefined);

  return session ? { tenant, session } : { tenant };
}

export async function fetchBootstrap(
  tenantId: string,
  options: FetchBootstrapOptions = {},
): Promise<BootstrapResponse> {
  setApiContext({ tenantId, token: options.token ?? null });

  if (APP_ENV.useMockApi) {
    return fetchMockBootstrap(tenantId);
  }

  try {
    const { data } = await apiClient.get<RawBootstrapResponse>(
      `/bootstrap/${encodeURIComponent(tenantId)}`,
    );

    return normalizeBootstrap(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new TenantNotFoundError(tenantId);
    }

    throw error;
  }
}
