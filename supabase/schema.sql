-- Esquema inicial para una instalación independiente de la plantilla Barbería.
create extension if not exists "pgcrypto";

create table empresas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  logo_url text,
  color_primario text not null default '#171715',
  color_secundario text not null default '#c7a66a',
  zona_horaria text not null default 'America/Argentina/Buenos_Aires',
  creada_en timestamptz not null default now()
);

create table perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  empresa_id uuid not null references empresas(id) on delete cascade,
  nombre text not null,
  telefono text,
  rol text not null check (rol in ('admin','recepcion','profesional','cliente')),
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create table sucursales (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  nombre text not null,
  direccion text not null,
  activa boolean not null default true
);

create table servicios (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  nombre text not null,
  descripcion text,
  duracion_minutos integer not null,
  precio_desde numeric(12,2),
  requiere_sena boolean not null default false,
  sena numeric(12,2),
  activo boolean not null default true
);

create table promociones (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  servicio_id uuid references servicios(id),
  nombre text not null,
  descripcion text,
  incluye jsonb not null default '[]',
  precio numeric(12,2) not null,
  precio_anterior numeric(12,2),
  activa boolean not null default true,
  vigente_desde date,
  vigente_hasta date
);

create table clientes (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  auth_user_id uuid references auth.users(id),
  nombre text not null,
  telefono text not null,
  email text,
  fecha_nacimiento date,
  observaciones text,
  creado_en timestamptz not null default now(),
  unique (empresa_id, telefono)
);

create table turnos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  sucursal_id uuid not null references sucursales(id),
  cliente_id uuid not null references clientes(id),
  servicio_id uuid not null references servicios(id),
  promocion_id uuid references promociones(id),
  fecha date not null,
  hora time not null,
  duracion_minutos integer not null,
  precio numeric(12,2),
  sena numeric(12,2),
  estado text not null default 'pendiente' check (estado in ('pendiente','confirmado','cancelado','realizado','ausente')),
  observaciones text,
  creado_en timestamptz not null default now()
);

create table actividad_turnos (
  id bigint generated always as identity primary key,
  empresa_id uuid not null references empresas(id) on delete cascade,
  turno_id uuid not null references turnos(id) on delete cascade,
  actor_id uuid references auth.users(id),
  accion text not null,
  anterior jsonb,
  nuevo jsonb,
  creado_en timestamptz not null default now()
);

create table notificaciones (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  cliente_id uuid not null references clientes(id) on delete cascade,
  turno_id uuid references turnos(id) on delete cascade,
  tipo text not null,
  titulo text not null,
  cuerpo text not null,
  programada_para timestamptz,
  enviada_en timestamptz,
  leida_en timestamptz
);

alter table empresas enable row level security;
alter table perfiles enable row level security;
alter table sucursales enable row level security;
alter table servicios enable row level security;
alter table promociones enable row level security;
alter table clientes enable row level security;
alter table turnos enable row level security;
alter table actividad_turnos enable row level security;
alter table notificaciones enable row level security;

-- Las políticas finales se generan por instalación y siempre comparan empresa_id
-- con la empresa asociada al usuario autenticado.
