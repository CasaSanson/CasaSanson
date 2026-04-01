-- ============================================================
--  FINANZAS — Casa Sansón
--  Correr en el SQL Editor de Supabase
-- ============================================================

-- 1. Tabla de gastos
-- ============================================================
create table if not exists gastos (
  id            uuid                     default gen_random_uuid() primary key,
  nombre        text                     not null,
  monto         numeric(12, 2)           not null default 0,
  unidades      integer                  not null default 1,
  fecha_compra  date                     not null,
  categoria     text                     not null default 'Otro'
                  check (categoria in (
                    'Materiales',
                    'Marketing',
                    'Maquila',
                    'Operaciones',
                    'Logística',
                    'Otro'
                  )),
  documento_url text,
  notas         text,
  created_at    timestamp with time zone default now()
);

-- 2. Row Level Security
-- ============================================================
alter table gastos enable row level security;

-- Política: solo usuarios autenticados pueden leer y escribir
create policy "gastos_authenticated_all"
  on gastos
  for all
  to authenticated
  using (true)
  with check (true);

-- 3. Bucket de almacenamiento para documentos (transferencias, facturas, etc.)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('gastos-docs', 'gastos-docs', true)
on conflict (id) do nothing;

-- Política de storage: usuarios autenticados pueden subir y leer
create policy "gastos_docs_select"
  on storage.objects for select
  using (bucket_id = 'gastos-docs');

create policy "gastos_docs_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gastos-docs');

create policy "gastos_docs_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gastos-docs');

-- 4. Índices útiles
-- ============================================================
create index if not exists gastos_fecha_idx      on gastos (fecha_compra desc);
create index if not exists gastos_categoria_idx  on gastos (categoria);
