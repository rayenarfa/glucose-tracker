# Quick Supabase Setup Reference

Essential steps to get your Glucose Tracker app connected to Supabase and Google OAuth.

## ⚡ Quick Setup (5 minutes)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name: `glucose-tracker`
4. Set database password
5. Choose region
6. Wait for setup (2-3 minutes)

### 2. Get Your Credentials

1. Go to Settings → API
2. Copy:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Set Up Database

1. Go to SQL Editor
2. Run this SQL:

```sql
-- Create tables
CREATE TABLE glucose_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 10 AND level <= 600),
    note TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('before_meal', 'after_meal')),
    meal_time TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE glucose_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own glucose logs" ON glucose_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own glucose logs" ON glucose_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own glucose logs" ON glucose_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own glucose logs" ON glucose_logs FOR DELETE USING (auth.uid() = user_id);
```

### 4. Set Up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Type: Web application
   - Redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     http://localhost:5173/auth/callback
     ```
5. Copy Client ID and Secret

### 5. Configure Supabase Auth

1. Go to Authentication → Providers
2. Enable Google provider
3. Enter Google Client ID and Secret
4. Save

### 6. Set Environment Variables

Create `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 7. Test

1. Run `npm run dev`
2. Try signing in with Google
3. Add a glucose reading
4. Check it appears in Supabase dashboard

## 🔧 For Production

### Update Redirect URIs

Add your production domain to Google OAuth:

```
https://your-domain.com/auth/callback
```

### Update Supabase Settings

1. Go to Authentication → URL Configuration
2. Set Site URL to your production domain
3. Add production redirect URL

## 🚨 Common Issues

**"Invalid redirect URI"**

- Check Google OAuth redirect URIs match exactly
- Include both localhost and production URLs

**"User not authenticated"**

- Verify environment variables are set correctly
- Check Supabase project is active

**Database connection errors**

- Ensure RLS policies are created
- Check user permissions

## 📞 Need Help?

- **Full Guide**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Google OAuth Docs**: [developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)

Your authentication is now ready! 🚀
