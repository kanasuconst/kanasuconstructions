# Supabase Migration & Deployment Guide

## 1. Supabase Setup

1. [Sign up at Supabase](https://supabase.com/) and create a new project.
2. Get your Supabase URL and anon key from Project Settings > API.
3. In the Supabase dashboard, go to SQL Editor and run the following SQL to create tables:

### contact_messages
```sql
create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### quotes
```sql
create table quotes (
  id uuid primary key default uuid_generate_v4(),
  plan_type text not null,
  area integer,
  full_name text not null,
  email text not null,
  phone text,
  location text,
  additional_requirements text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### projects
```sql
create table projects (
  id uuid primary key default uuid_generate_v4(),
  project_name text not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### testimonials
```sql
create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  user_name text not null,
  testimonial_text text,
  user_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

4. Go to Storage > Create two buckets:
   - `project-images`
   - `testimonial-images`

5. Go to Authentication > Users > Invite or create admin users (email/password).

6. Set up Row Level Security (RLS) as needed for admin-only access.

---

## 2. Frontend Configuration

1. In `js/supabase-config.js`, replace the placeholders with your Supabase URL and anon key:
   ```js
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
   ```
2. All Firebase logic has been removed. The following files now use Supabase:
   - `js/forms.js` (contact & quote forms)
   - `js/admin-auth.js` (admin login)
   - `js/scripts.js` (project & testimonial upload)
   - `js/main.js` (admin dashboard fetch)

---

## 3. Deploy Frontend to Netlify

1. Push your project to GitHub.
2. [Sign up at Netlify](https://www.netlify.com/) and connect your GitHub repo.
3. Deploy the site. No build step is needed for static HTML/JS/CSS.
4. Ensure your site loads the correct Supabase config.

---

## 4. Usage Notes

- All data is now stored in Supabase tables and storage.
- Only authenticated admins (via Supabase Auth) can access admin features.
- You can further secure endpoints using Supabase RLS policies.

---

## 5. Migration Checklist

- [x] Supabase tables created
- [x] Storage buckets created
- [x] Admin users set up
- [x] Frontend JS updated to use Supabase
- [x] Firebase code deprecated
- [x] Ready for Netlify deployment

---

For any issues, refer to [Supabase Docs](https://supabase.com/docs) or [Netlify Docs](https://docs.netlify.com/). 