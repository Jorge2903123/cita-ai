interface ApiRuntimeContext {
  token: string | null;
  tenantId: string | null;
}

const runtimeContext: ApiRuntimeContext = {
  token: null,
  tenantId: null,
};

export function setApiContext(
  patch: Partial<ApiRuntimeContext>,
): Readonly<ApiRuntimeContext> {
  if (patch.token !== undefined) {
    runtimeContext.token = patch.token;
  }
  if (patch.tenantId !== undefined) {
    runtimeContext.tenantId = patch.tenantId;
  }
  return runtimeContext;
}

export function getApiContext(): Readonly<ApiRuntimeContext> {
  return runtimeContext;
}
