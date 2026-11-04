export const USER_ROLES = ["admin", "staff", "customer"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const MODULE_SLUGS = [
  "appointments",
  "customers",
  "services",
  "billing",
] as const;

export type ModuleSlug = (typeof MODULE_SLUGS)[number];

export type BusinessType =
  | "barbershop"
  | "veterinary"
  | "auto_repair"
  | "clinic"
  | "beauty_salon"
  | "other";

export type PermissionAction =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "manage";

export interface TenantTheme {
  primary: string;
  secondary: string;
  accent?: string;
  on_primary?: string;
  surface?: string;
}

export interface TenantLabels {
  customer?: string;
  customers?: string;
  customer_plural?: string;
  professional?: string;
  professionals?: string;
  item?: string;
  items?: string;
  appointment?: string;
  appointments?: string;
  service?: string;
  services?: string;
  billing?: string;
  [key: string]: string | undefined;
}

export interface RolePermission {
  modules: ModuleSlug[];
  actions: PermissionAction[];
}

export type RolePermissions = Partial<Record<UserRole, RolePermission>>;

export interface TenantConfig {
  tenant_id: string;
  slug?: string;
  name: string;
  business_type: BusinessType;
  logo_url?: string;
  theme: TenantTheme;
  modules: ModuleSlug[];
  labels: TenantLabels;
  role_permissions: RolePermissions;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenant_id: string;
  avatar_url?: string;
}

export interface AuthSession {
  access_token: string;
  user: AuthUser;
}

export interface BootstrapResponse {
  tenant: TenantConfig;
  session?: AuthSession;
}

export interface RawBootstrapResponse {
  tenant?: TenantConfig;
  schema_config?: TenantConfig;
  session?: AuthSession;
  user?: AuthUser;
  access_token?: string;
}

export type LabelKey = Extract<keyof TenantLabels, string>;

export const DEFAULT_LABELS: Record<
  "customer" | "customers" | "professional" | "item" | "appointment" | "service" | "billing",
  string
> = {
  customer: "Cliente",
  customers: "Clientes",
  professional: "Profesional",
  item: "Registro",
  appointment: "Cita",
  service: "Servicio",
  billing: "Cobros",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  staff: "Staff",
  customer: "Cliente",
};
