-- Optional map coordinates for church marketplace globe pins
alter table public.churches
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

create index if not exists churches_coords_idx
  on public.churches (latitude, longitude)
  where latitude is not null and longitude is not null;
