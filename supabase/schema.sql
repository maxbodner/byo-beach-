-- ============================================================================
-- BYO Beach — Supabase database schema
-- Run this entire file in the Supabase SQL editor (one time, fresh project)
-- ============================================================================

-- Main pins table
create table if not exists pins (
  id           uuid primary key default gen_random_uuid(),
  lat          double precision not null,
  lng          double precision not null,
  first_name   text not null check (char_length(first_name) between 1 and 30),
  beach_name   text not null check (char_length(beach_name) between 1 and 60),
  state        text not null check (char_length(state) between 1 and 60),
  note         text check (char_length(note) <= 200),
  status       text not null default 'approved' check (status in ('pending','approved','rejected')),
  created_at   timestamptz not null default now()
);

-- Indexes for performance
create index if not exists pins_status_idx on pins(status);
create index if not exists pins_created_idx on pins(created_at desc);

-- ============================================================================
-- Row-Level Security
-- ============================================================================

alter table pins enable row level security;

-- Anyone can SELECT approved pins
create policy "Approved pins are publicly readable"
  on pins for select
  using (status = 'approved');

-- Anyone can INSERT new pins (status will be set per the column default)
create policy "Anyone can submit a pin"
  on pins for insert
  with check (true);

-- ============================================================================
-- Notes for launch
-- ============================================================================
-- The default status is 'approved' for instant pin appearance during launch.
-- To enable a moderation queue:
--   1. Change the default to 'pending':
--        alter table pins alter column status set default 'pending';
--   2. Pins will then need manual approval:
--        update pins set status = 'approved' where id = '...';
-- ============================================================================
