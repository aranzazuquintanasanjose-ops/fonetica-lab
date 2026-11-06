-- FONÉTICA-LAB 3.1 · Ejecutar UNA VEZ en Supabase > SQL Editor.
-- No sustituye la revisión de protección de datos exigible por tu institución.

create extension if not exists pgcrypto;

create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  access_code text not null unique check (access_code ~ '^[A-Z0-9]{8}$'),
  title text not null check (length(title) between 3 and 100),
  owner_id uuid not null references auth.users(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_events (
  id bigint generated always as identity primary key,
  class_code text not null check (class_code ~ '^[A-Z0-9]{8}$'),
  student_code text not null check (student_code ~ '^ALU-[A-Z2-9]{10}$'),
  event_type text not null check (event_type in ('inicio_sesion','visita_seccion','actividad_finalizada','laboratorio_uso')),
  module text not null check (length(module) between 1 and 70),
  score integer null check (score between 0 and 40),
  total integer null check (total between 0 and 40),
  duration_seconds integer null check (duration_seconds between 0 and 7200),
  details jsonb not null default '{}'::jsonb check (octet_length(details::text) <= 6500),
  app_version text not null default '3.1' check (length(app_version) <= 20),
  created_at timestamptz not null default now(),
  constraint score_not_above_total check (score is null or total is null or score <= total)
);

create index if not exists learning_events_class_time_idx on public.learning_events (class_code, created_at desc);
create index if not exists learning_events_student_idx on public.learning_events (class_code, student_code);

-- Comprobar un código de aula sin exponer los grupos al alumnado.
create or replace function public.is_active_class(class_code_input text)
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists(select 1 from public.classrooms c where c.access_code = class_code_input and c.active = true);
$$;
revoke all on function public.is_active_class(text) from public;
grant execute on function public.is_active_class(text) to anon, authenticated;

alter table public.classrooms enable row level security;
alter table public.learning_events enable row level security;

-- Se restablecen las políticas si se ejecuta el archivo otra vez.
drop policy if exists "docente_ver_sus_clases" on public.classrooms;
drop policy if exists "docente_crear_su_clase" on public.classrooms;
drop policy if exists "docente_modificar_su_clase" on public.classrooms;
drop policy if exists "docente_borrar_su_clase" on public.classrooms;
drop policy if exists "alumnado_enviar_sin_leer" on public.learning_events;
drop policy if exists "docente_leer_eventos_sus_clases" on public.learning_events;
drop policy if exists "docente_borrar_eventos_sus_clases" on public.learning_events;

create policy "docente_ver_sus_clases" on public.classrooms
  for select to authenticated using (owner_id = (select auth.uid()));
create policy "docente_crear_su_clase" on public.classrooms
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "docente_modificar_su_clase" on public.classrooms
  for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "docente_borrar_su_clase" on public.classrooms
  for delete to authenticated using (owner_id = (select auth.uid()));

-- Usuarios sin cuenta pueden INSERTAR, pero no leer ni modificar registros.
create policy "alumnado_enviar_sin_leer" on public.learning_events
  for insert to anon with check (
    public.is_active_class(class_code)
    and ((event_type = 'actividad_finalizada' and score is not null and total > 0) or
         (event_type <> 'actividad_finalizada' and score is null and total is null))
  );
create policy "docente_leer_eventos_sus_clases" on public.learning_events
  for select to authenticated using (
    exists (select 1 from public.classrooms c where c.access_code = learning_events.class_code
      and c.owner_id = (select auth.uid()))
  );
create policy "docente_borrar_eventos_sus_clases" on public.learning_events
  for delete to authenticated using (
    exists (select 1 from public.classrooms c where c.access_code = learning_events.class_code
      and c.owner_id = (select auth.uid()))
  );

-- Principio de mínimo privilegio: no se permite a personas sin autenticar leer resultados.
revoke all on table public.classrooms from public, anon, authenticated;
revoke all on table public.learning_events from public, anon, authenticated;
grant select, insert, update, delete on table public.classrooms to authenticated;
grant select, delete on table public.learning_events to authenticated;
grant insert on table public.learning_events to anon;
-- La columna id usa una identity: Postgres la gestiona internamente.

-- NOTA: activa el proveedor Email de Supabase Auth y crea una cuenta docente
-- en Authentication > Users. No introduzcas tu contraseña aquí ni en GitHub.
