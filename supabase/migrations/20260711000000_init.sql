-- Trinity social platform schema + RLS
-- Run in Supabase SQL editor or via supabase db push

create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  display_name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_]{3,24}$')
);

-- Groups
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  avatar_url text,
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

-- Posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  group_id uuid references public.groups (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  media_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- Messaging
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  is_group_dm boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('like', 'comment', 'group_invite', 'message', 'follow')),
  actor_id uuid references public.profiles (id) on delete set null,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_group_id_idx on public.posts (group_id);
create index if not exists comments_post_id_idx on public.comments (post_id);
create index if not exists messages_conversation_id_idx on public.messages (conversation_id, created_at);
create index if not exists notifications_user_id_idx on public.notifications (user_id, created_at desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1), 'user'),
    '[^a-z0-9_]',
    '',
    'g'
  ));
  if char_length(base_username) < 3 then
    base_username := 'user';
  end if;
  final_username := left(base_username, 20) || substr(replace(new.id::text, '-', ''), 1, 4);

  insert into public.profiles (id, username, display_name, bio, avatar_url)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Trinity member'),
    null,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is group member
create or replace function public.is_group_member(gid uuid, uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.group_members gm
    where gm.group_id = gid and gm.user_id = uid
  );
$$;

create or replace function public.is_conversation_member(cid uuid, uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = cid and cm.user_id = uid
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- Profiles policies
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Groups policies
create policy "Groups are viewable by everyone"
  on public.groups for select using (true);

create policy "Authenticated users can create groups"
  on public.groups for insert with check (auth.uid() = created_by);

create policy "Group creators can update groups"
  on public.groups for update using (auth.uid() = created_by);

-- Group members
create policy "Group members are viewable by everyone"
  on public.group_members for select using (true);

create policy "Users can join groups"
  on public.group_members for insert with check (auth.uid() = user_id);

create policy "Users can leave groups"
  on public.group_members for delete using (auth.uid() = user_id);

-- Posts: public feed posts OR group posts if member / public read for simplicity
create policy "Posts are viewable by authenticated users"
  on public.posts for select to authenticated using (
    group_id is null or public.is_group_member(group_id, auth.uid())
  );

create policy "Users can create posts"
  on public.posts for insert with check (
    auth.uid() = author_id
    and (group_id is null or public.is_group_member(group_id, auth.uid()))
  );

create policy "Users can delete own posts"
  on public.posts for delete using (auth.uid() = author_id);

-- Comments
create policy "Comments viewable if post viewable"
  on public.comments for select to authenticated using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and (p.group_id is null or public.is_group_member(p.group_id, auth.uid()))
    )
  );

create policy "Users can create comments"
  on public.comments for insert with check (auth.uid() = author_id);

create policy "Users can delete own comments"
  on public.comments for delete using (auth.uid() = author_id);

-- Likes
create policy "Likes viewable by authenticated"
  on public.likes for select to authenticated using (true);

create policy "Users can like"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike"
  on public.likes for delete using (auth.uid() = user_id);

-- Conversations
create policy "Members can view conversations"
  on public.conversations for select to authenticated using (
    public.is_conversation_member(id, auth.uid())
  );

create policy "Authenticated can create conversations"
  on public.conversations for insert to authenticated with check (true);

create policy "Members can view conversation members"
  on public.conversation_members for select to authenticated using (
    public.is_conversation_member(conversation_id, auth.uid())
  );

create policy "Users can add themselves to conversations"
  on public.conversation_members for insert to authenticated with check (auth.uid() = user_id);

-- Create 1:1 DM (bypasses member insert RLS for the other user)
create or replace function public.create_direct_conversation(other_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_id uuid;
  new_id uuid;
begin
  if other_user_id = auth.uid() then
    raise exception 'Cannot create a conversation with yourself';
  end if;

  select c.id into existing_id
  from public.conversations c
  join public.conversation_members a on a.conversation_id = c.id and a.user_id = auth.uid()
  join public.conversation_members b on b.conversation_id = c.id and b.user_id = other_user_id
  where c.is_group_dm = false
    and (
      select count(*) from public.conversation_members cm where cm.conversation_id = c.id
    ) = 2
  limit 1;

  if existing_id is not null then
    return existing_id;
  end if;

  insert into public.conversations (is_group_dm) values (false) returning id into new_id;
  insert into public.conversation_members (conversation_id, user_id) values
    (new_id, auth.uid()),
    (new_id, other_user_id);

  return new_id;
end;
$$;

grant execute on function public.create_direct_conversation(uuid) to authenticated;

-- Messages
create policy "Members can view messages"
  on public.messages for select to authenticated using (
    public.is_conversation_member(conversation_id, auth.uid())
  );

create policy "Members can send messages"
  on public.messages for insert to authenticated with check (
    auth.uid() = sender_id
    and public.is_conversation_member(conversation_id, auth.uid())
  );

-- Notifications
create policy "Users can view own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update using (auth.uid() = user_id);

create policy "Authenticated can insert notifications"
  on public.notifications for insert to authenticated with check (true);

-- Storage buckets (run after creating buckets in dashboard or via API)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own avatar"
  on storage.objects for update to authenticated using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Media is publicly accessible"
  on storage.objects for select using (bucket_id = 'media');

create policy "Users can upload media"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Realtime
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
