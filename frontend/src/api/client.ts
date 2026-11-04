import axios from "axios";
import { APP_ENV } from "@/config/env";
import { toApiError } from "@/utils/errors";
import { getApiContext } from "./runtime";

export const apiClient = axios.create({
  baseURL: APP_ENV.apiBaseUrl,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const { token, tenantId } = getApiContext();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  if (tenantId) {
    config.headers.set("X-Tenant-Id", tenantId);
    config.headers.set("X-Tenant-Slug", tenantId);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);

    if (apiError.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("citaai:unauthorized"));
    }

    return Promise.reject(apiError);
  },
);
