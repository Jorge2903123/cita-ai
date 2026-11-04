const env = import.meta.env;

export const APP_ENV = {
  appName: env.VITE_APP_NAME ?? "Cita:AI",
  apiBaseUrl: env.VITE_API_URL ?? "/api/v1",
  defaultTenant: env.VITE_DEFAULT_TENANT ?? "",
  useMockApi: env.VITE_USE_MOCK_API === "true",
} as const;
