import { useCallback } from "react";
import { resolveLabel } from "@/utils/tenant";
import { useTenant } from "./useTenant";

export type DynamicLabelResolver = (
  key: string,
  fallback?: string,
) => string;

export function useDynamicLabel(): DynamicLabelResolver {
  const { tenant } = useTenant();

  return useCallback(
    (key: string, fallback?: string) =>
      resolveLabel(tenant?.labels, key, fallback),
    [tenant],
  );
}
