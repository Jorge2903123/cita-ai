import type {
  AuthSession,
  BootstrapResponse,
  TenantConfig,
  UserRole,
} from "@/types/tenant";
import { TenantNotFoundError } from "@/utils/errors";
import { isUserRole } from "@/utils/tenant";

const DEMO_TENANTS: Record<string, TenantConfig> = {
  "barberia-elite": {
    tenant_id: "barberia-elite",
    slug: "barberia-elite",
    name: "Barbería Elite",
    business_type: "barbershop",
    theme: {
      primary: "#4f46e5",
      secondary: "#111827",
      accent: "#818cf8",
      on_primary: "#ffffff",
      surface: "#f8fafc",
    },
    modules: ["appointments", "customers", "services", "billing"],
    labels: {
      customer: "Cliente",
      customers: "Clientes",
      professional: "Barbero",
      professionals: "Barberos",
      item: "Servicio",
      appointment: "Cita",
      appointments: "Citas",
      service: "Servicio",
      services: "Servicios",
      billing: "Caja",
    },
    role_permissions: {
      admin: {
        modules: ["appointments", "customers", "services", "billing"],
        actions: ["read", "create", "update", "delete", "manage"],
      },
      staff: {
        modules: ["appointments", "customers", "services"],
        actions: ["read", "create", "update"],
      },
      customer: {
        modules: ["appointments"],
        actions: ["read"],
      },
    },
  },
  "veterinaria-petcare": {
    tenant_id: "veterinaria-petcare",
    slug: "veterinaria-petcare",
    name: "Veterinaria PetCare",
    business_type: "veterinary",
    theme: {
      primary: "#059669",
      secondary: "#064e3b",
      accent: "#34d399",
      on_primary: "#ffffff",
      surface: "#f0fdf4",
    },
    modules: ["appointments", "customers", "services", "billing"],
    labels: {
      customer: "Paciente",
      customers: "Pacientes",
      professional: "Veterinario",
      professionals: "Veterinarios",
      item: "Mascota",
      items: "Mascotas",
      appointment: "Consulta",
      appointments: "Consultas",
      service: "Tratamiento",
      services: "Tratamientos",
      billing: "Cobros",
    },
    role_permissions: {
      admin: {
        modules: ["appointments", "customers", "services", "billing"],
        actions: ["read", "create", "update", "delete", "manage"],
      },
      staff: {
        modules: ["appointments", "customers", "services"],
        actions: ["read", "create", "update"],
      },
      customer: {
        modules: ["appointments"],
        actions: ["read"],
      },
    },
  },
  "taller-mecanico": {
    tenant_id: "taller-mecanico",
    slug: "taller-mecanico",
    name: "Taller MotorLab",
    business_type: "auto_repair",
    theme: {
      primary: "#d97706",
      secondary: "#1c1917",
      accent: "#fbbf24",
      on_primary: "#1c1917",
      surface: "#fffbeb",
    },
    modules: ["appointments", "customers", "billing"],
    labels: {
      customer: "Cliente",
      customers: "Clientes",
      professional: "Mecánico",
      professionals: "Mecánicos",
      item: "Vehículo",
      items: "Vehículos",
      appointment: "Reserva",
      appointments: "Reservas",
      service: "Servicio",
      services: "Servicios",
      billing: "Facturación",
    },
    role_permissions: {
      admin: {
        modules: ["appointments", "customers", "billing"],
        actions: ["read", "create", "update", "delete", "manage"],
      },
      staff: {
        modules: ["appointments", "customers"],
        actions: ["read", "create", "update"],
      },
      customer: {
        modules: ["appointments"],
        actions: ["read"],
      },
    },
  },
};

const DEMO_PROFILES: Record<UserRole, AuthSession["user"]> = {
  admin: {
    id: "user-admin",
    name: "Ana Martínez",
    email: "admin@citaai.com",
    role: "admin",
    tenant_id: "",
  },
  staff: {
    id: "user-staff",
    name: "Carlos Rivera",
    email: "staff@citaai.com",
    role: "staff",
    tenant_id: "",
  },
  customer: {
    id: "user-customer",
    name: "Lucía Herrera",
    email: "cliente@citaai.com",
    role: "customer",
    tenant_id: "",
  },
};

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

export async function fetchMockBootstrap(
  tenantId: string,
): Promise<BootstrapResponse> {
  await wait(420);

  const tenant = DEMO_TENANTS[tenantId];

  if (!tenant) {
    throw new TenantNotFoundError(tenantId);
  }

  const role = readDemoRole();
  const profile = DEMO_PROFILES[role];

  return {
    tenant,
    session: {
      access_token: `demo.${tenantId}.${role}`,
      user: { ...profile, tenant_id: tenant.tenant_id },
    },
  };
}

export function getDemoTenantIds(): string[] {
  return Object.keys(DEMO_TENANTS);
}
