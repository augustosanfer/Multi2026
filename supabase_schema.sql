-- Tabela de Vendas
create table if not exists public.sales (
  id text primary key,
  user_id uuid not null references auth.users(id), -- Vincula ao Auth User do Supabase
  client_name text not null,
  sale_date date not null,
  project text,
  sale_value numeric,
  commission_total numeric,
  raw_data jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (Segurança a Nível de Linha)
alter table public.sales enable row level security;

-- Política: Usuário só vê suas próprias vendas
create policy "Users can view their own sales"
  on public.sales for select
  using (auth.uid() = user_id);

-- Política: Usuário só insere vendas vinculadas ao seu ID
create policy "Users can insert their own sales"
  on public.sales for insert
  with check (auth.uid() = user_id);

-- Política: Usuário só atualiza suas próprias vendas
create policy "Users can update their own sales"
  on public.sales for update
  using (auth.uid() = user_id);

-- Política: Usuário só deleta suas próprias vendas
create policy "Users can delete their own sales"
  on public.sales for delete
  using (auth.uid() = user_id);
