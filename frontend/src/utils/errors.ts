import axios from "axios";

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export class TenantNotFoundError extends ApiError {
  readonly tenantId: string;

  constructor(tenantId: string) {
    super(`No encontramos el negocio "${tenantId}".`, 404, "TENANT_NOT_FOUND");
    this.name = "TenantNotFoundError";
    this.tenantId = tenantId;
  }
}

export class BootstrapFormatError extends ApiError {
  constructor() {
    super(
      "La configuración del negocio no tiene el formato esperado.",
      500,
      "BOOTSTRAP_FORMAT_ERROR",
    );
    this.name = "BootstrapFormatError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const payload = error.response?.data;
    const message =
      isRecord(payload) && typeof payload.message === "string"
        ? payload.message
        : error.message;

    return new ApiError(message, status, error.code);
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("Ocurrió un error inesperado.");
}
