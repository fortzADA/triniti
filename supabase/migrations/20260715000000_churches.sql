-- Church marketplace + per-church portals
-- Run after 20260711000000_init.sql

-- Churches
create table if not exists public.churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  tagline text,
  description text,
  logo_url text,
  cover_url text,
  city text,
  country text,
  website text,
  email text,
  phone text,
  created_by uuid not null references public.profiles (id) on delete cascade,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  constraint church_slug_format check (slug ~ '^[a-z0-9-]{2,48}$')
);

create table if not exists public.church_members (
  church_id uuid not null references public.churches (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  status text not null default 'pending' check (status in ('pending', 'active')),
  created_at timestamptz not null default now(),
  primary key (church_id, user_id)
);

create index if not exists churches_slug_idx on public.churches (slug);
create index if not exists churches_public_idx on public.churches (is_public, created_at desc);
create index if not exists church_members_user_idx on public.church_members (user_id, status);

-- Scope existing content to churches
alter table public.posts
  add column if not exists church_id uuid references public.churches (id) on delete cascade;

alter table public.groups
  add column if not exists church_id uuid references public.churches (id) on delete cascade;

create index if not exists posts_church_id_idx on public.posts (church_id, created_at desc);
create index if not exists groups_church_id_idx on public.groups (church_id);

-- Group slug unique per church (drop global unique if present)
alter table public.groups drop constraint if exists groups_slug_key;
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'groups_church_slug_unique'
  ) then
    alter table public.groups
      add constraint groups_church_slug_unique unique (church_id, slug);
  end if;
end $$;

-- Helpers
create or replace function public.is_church_member(cid uuid, uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.church_members cm
    where cm.church_id = cid
      and cm.user_id = uid
      and cm.status = 'active'
  );
$$;

create or replace function public.is_church_admin(cid uuid, uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.church_members cm
    where cm.church_id = cid
      and cm.user_id = uid
      and cm.status = 'active'
      and cm.role in ('owner', 'admin')
  );
$$;

-- Create church + owner membership
create or replace function public.create_church(
  p_name text,
  p_slug text,
  p_tagline text default null,
  p_description text default null,
  p_city text default null,
  p_country text default null
)
returns public.churches
language plpgsql
security definer
set search_path = public
as $$
declare
  new_church public.churches;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if exists (select 1 from public.churches c where c.slug = p_slug) then
    raise exception 'Church slug already taken';
  end if;

  -- v1: one owned church per user
  if exists (
    select 1 from public.church_members cm
    where cm.user_id = auth.uid() and cm.role = 'owner' and cm.status = 'active'
  ) then
    raise exception 'You already own a church';
  end if;

  insert into public.churches (
    name, slug, tagline, description, city, country, created_by
  ) values (
    p_name, p_slug, p_tagline, p_description, p_city, p_country, auth.uid()
  )
  returning * into new_church;

  insert into public.church_members (church_id, user_id, role, status)
  values (new_church.id, auth.uid(), 'owner', 'active');

  return new_church;
end;
$$;

grant execute on function public.create_church(text, text, text, text, text, text) to authenticated;
grant execute on function public.is_church_member(uuid, uuid) to authenticated;
grant execute on function public.is_church_admin(uuid, uuid) to authenticated;

-- RLS
alter table public.churches enable row level security;
alter table public.church_members enable row level security;

create policy "Public churches are viewable by everyone"
  on public.churches for select
  using (is_public = true or created_by = auth.uid() or public.is_church_member(id, auth.uid()));

create policy "Authenticated users can create churches"
  on public.churches for insert to authenticated
  with check (auth.uid() = created_by);

create policy "Church admins can update churches"
  on public.churches for update to authenticated
  using (public.is_church_admin(id, auth.uid()));

-- Membership policies
create policy "Members can view memberships of their churches"
  on public.church_members for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_church_member(church_id, auth.uid())
    or public.is_church_admin(church_id, auth.uid())
  );

create policy "Users can request to join a church"
  on public.church_members for insert to authenticated
  with check (
    auth.uid() = user_id
    and role = 'member'
    and status = 'pending'
  );

create policy "Admins can update memberships"
  on public.church_members for update to authenticated
  using (public.is_church_admin(church_id, auth.uid()));

create policy "Users can leave or admins can remove"
  on public.church_members for delete to authenticated
  using (
    user_id = auth.uid()
    or public.is_church_admin(church_id, auth.uid())
  );

-- Replace post policies to require church membership when church_id set
drop policy if exists "Posts are viewable by authenticated users" on public.posts;
drop policy if exists "Users can create posts" on public.posts;

create policy "Posts viewable by church members"
  on public.posts for select to authenticated
  using (
    church_id is not null
    and public.is_church_member(church_id, auth.uid())
    and (group_id is null or public.is_group_member(group_id, auth.uid()) or group_id is not null)
  );

-- Simplify: if church member, can see church posts (including group posts in that church)
drop policy if exists "Posts viewable by church members" on public.posts;
create policy "Posts viewable by church members"
  on public.posts for select to authenticated
  using (
    church_id is not null and public.is_church_member(church_id, auth.uid())
  );

create policy "Users can create church posts"
  on public.posts for insert to authenticated
  with check (
    auth.uid() = author_id
    and church_id is not null
    and public.is_church_member(church_id, auth.uid())
    and (group_id is null or public.is_group_member(group_id, auth.uid()))
  );

-- Groups: scoped to church
drop policy if exists "Groups are viewable by everyone" on public.groups;
drop policy if exists "Authenticated users can create groups" on public.groups;
drop policy if exists "Group creators can update groups" on public.groups;

create policy "Church members can view church groups"
  on public.groups for select to authenticated
  using (
    church_id is not null and public.is_church_member(church_id, auth.uid())
  );

create policy "Church members can create groups"
  on public.groups for insert to authenticated
  with check (
    auth.uid() = created_by
    and church_id is not null
    and public.is_church_member(church_id, auth.uid())
  );

create policy "Group creators or church admins can update groups"
  on public.groups for update to authenticated
  using (
    auth.uid() = created_by
    or (church_id is not null and public.is_church_admin(church_id, auth.uid()))
  );

-- Comments tied to viewable posts (update existing)
drop policy if exists "Comments viewable if post viewable" on public.comments;
create policy "Comments viewable if post viewable"
  on public.comments for select to authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and p.church_id is not null
        and public.is_church_member(p.church_id, auth.uid())
    )
  );
