create table profiles (
  id uuid default uuid_generate_v4() primary key,
  updated_at timestamp default now(),
  full_name text,
  avatar_url text
);

create table chats (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now(),
  title text,
  owner uuid references profiles (id),
  model text,
  system_prompt text,
  advanced_settings jsonb,
  history_type text
);

create table messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp default now(),
  content text,
  role text,
  chat uuid references chats (id),
  owner uuid references profiles (id),
  embedding public.vector(1536),
  token_size integer
);

