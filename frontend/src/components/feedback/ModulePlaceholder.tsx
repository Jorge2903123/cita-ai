import { useDynamicLabel } from "@/hooks/useDynamicLabel";
import type { ModuleSlug } from "@/types/tenant";
import { humanize } from "@/utils/tenant";

export interface ModulePlaceholderProps {
  slug: ModuleSlug;
  labelKey: string;
  description: string;
}

export function ModulePlaceholder({
  slug,
  labelKey,
  description,
}: ModulePlaceholderProps) {
  const label = useDynamicLabel();
  const title = label(labelKey, humanize(slug));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">
          Módulo: {slug}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <div className="flex min-h-[420px] items-center justify-center rounded border border-dashed border-gray-300 bg-white px-6 py-12">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            Vista pendiente de diseño
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Aquí va el mockup de {title}.
          </p>
        </div>
      </div>
    </div>
  );
}
