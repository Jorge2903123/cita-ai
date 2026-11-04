import {
  lazy,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import {
  CalendarDays,
  ReceiptText,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ModuleSlug } from "@/types/tenant";
import { isModuleSlug } from "@/utils/tenant";

export interface ModuleDefinition {
  slug: ModuleSlug;
  labelKey: string;
  description: string;
  icon: LucideIcon;
  component: LazyExoticComponent<ComponentType>;
}

export const MODULE_REGISTRY: Record<ModuleSlug, ModuleDefinition> = {
  appointments: {
    slug: "appointments",
    labelKey: "appointments",
    description: "Agenda, confirma y da seguimiento a tus reservaciones.",
    icon: CalendarDays,
    component: lazy(() => import("@/modules/appointments/AppointmentsView")),
  },
  customers: {
    slug: "customers",
    labelKey: "customers",
    description: "Directorio central con información dinámica por negocio.",
    icon: Users,
    component: lazy(() => import("@/modules/customers/CustomersView")),
  },
  services: {
    slug: "services",
    labelKey: "services",
    description: "Catálogo de servicios, duraciones y precios.",
    icon: Wrench,
    component: lazy(() => import("@/modules/services/ServicesView")),
  },
  billing: {
    slug: "billing",
    labelKey: "billing",
    description: "Caja, ingresos y transacciones del negocio.",
    icon: ReceiptText,
    component: lazy(() => import("@/modules/billing/BillingView")),
  },
};

export function getModuleDefinition(
  slug: string,
): ModuleDefinition | null {
  return isModuleSlug(slug) ? MODULE_REGISTRY[slug] : null;
}
