-- Events Table
CREATE TABLE public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  date text NOT NULL,
  location text NOT NULL,
  image text,
  "aboutText" text,
  "frontPageHtml" text,
  "programmeHtml" text,
  admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Attendee Profiles Table
CREATE TABLE public.attendee_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  company text NOT NULL,
  linkedin text,
  headshot_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, event_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendee_profiles ENABLE ROW LEVEL SECURITY;

-- Events Policies
CREATE POLICY "Public events are viewable by everyone."
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert their own events."
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Admins can update their own events."
  ON public.events FOR UPDATE
  USING (auth.uid() = admin_id);

CREATE POLICY "Admins can delete their own events."
  ON public.events FOR DELETE
  USING (auth.uid() = admin_id);

-- Attendee Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.attendee_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.attendee_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile."
  ON public.attendee_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile."
  ON public.attendee_profiles FOR DELETE
  USING (auth.uid() = user_id);
