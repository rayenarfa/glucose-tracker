# Supabase & Authentication Setup Guide

Complete guide to set up Supabase backend, Google OAuth, and authentication for your Glucose Tracker app.

## 🚀 Quick Setup Overview

1. **Create Supabase Project** → Set up database
2. **Configure Google OAuth** → Enable authentication
3. **Set up Database Schema** → Create tables and policies
4. **Configure Environment Variables** → Connect frontend to backend
5. **Test Authentication** → Verify everything works

## 📋 Step-by-Step Setup

### Step 1: Create Supabase Project

1. **Go to Supabase**

   - Visit [supabase.com](https://supabase.com)
   - Sign up or log in with your GitHub account

2. **Create New Project**

   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - **Name**: `glucose-tracker` (or your preferred name)
     - **Database Password**: Generate a strong password
     - **Region**: Choose closest to your users
   - Click "Create new project"

3. **Wait for Setup**
   - Supabase will provision your database (2-3 minutes)
   - You'll receive an email when ready

### Step 2: Get Your Project Credentials

1. **Go to Project Settings**

   - In your Supabase dashboard, click the gear icon (Settings)
   - Select "API" from the sidebar

2. **Copy Your Credentials**

   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: (Keep this secret, only for admin operations)

3. **Save These Securely**
   - You'll need these for your environment variables
   - Never commit them to version control

### Step 3: Set Up Database Schema

1. **Open SQL Editor**

   - In Supabase dashboard, click "SQL Editor" in the sidebar
   - Click "New query"

2. **Create the Database Schema**
   Copy and paste this SQL:

```sql
-- Create glucose_logs table
CREATE TABLE IF NOT EXISTS glucose_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 10 AND level <= 600),
    note TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('before_meal', 'after_meal')),
    meal_time TIMESTAMP WITH TIME ZONE
);

-- Create medications table (optional)
CREATE TABLE IF NOT EXISTS medications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    type TEXT,
    time_taken TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    target_min INTEGER DEFAULT 90,
    target_max INTEGER DEFAULT 140,
    units TEXT DEFAULT 'mg/dL' CHECK (units IN ('mg/dL', 'mmol/L')),
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE glucose_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for glucose_logs
CREATE POLICY "Users can insert their own glucose logs"
ON glucose_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own glucose logs"
ON glucose_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own glucose logs"
ON glucose_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own glucose logs"
ON glucose_logs FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS Policies for medications
CREATE POLICY "Users can insert their own medications"
ON medications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own medications"
ON medications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications"
ON medications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications"
ON medications FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS Policies for user_settings
CREATE POLICY "Users can insert their own settings"
ON user_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own settings"
ON user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON user_settings FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_glucose_logs_user_id ON glucose_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_glucose_logs_logged_at ON glucose_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);
CREATE INDEX IF NOT EXISTS idx_medications_time_taken ON medications(time_taken);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_settings
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

3. **Run the SQL**
   - Click "Run" to execute the schema
   - You should see success messages

### Step 4: Configure Google OAuth

#### A. Set Up Google Cloud Console

1. **Go to Google Cloud Console**

   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Google+ API**

   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google Identity" if available

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     http://localhost:5173/auth/callback
     https://your-domain.com/auth/callback
     ```
   - Click "Create"
   - **Save your Client ID and Client Secret**

#### B. Configure Supabase Auth

1. **Go to Supabase Auth Settings**

   - In Supabase dashboard, go to "Authentication" → "Providers"
   - Find "Google" and click "Edit"

2. **Enable Google Provider**

   - Toggle "Enable" to ON
   - Enter your Google credentials:
     - **Client ID**: Your Google OAuth Client ID
     - **Client Secret**: Your Google OAuth Client Secret
   - Click "Save"

3. **Configure URL Settings**
   - Go to "Authentication" → "URL Configuration"
   - Set your site URLs:
     - **Site URL**: `https://your-domain.com` (or localhost for development)
     - **Redirect URLs**: Add your domain's auth callback

### Step 5: Set Up Environment Variables

1. **Create .env File**
   In your project root, create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. **For Production Deployment**
   Add these same variables to your hosting platform:
   - **Netlify**: Site settings → Environment variables
   - **Vercel**: Project settings → Environment variables
   - **GitHub Pages**: Repository secrets (if using GitHub Actions)

### Step 6: Test Authentication

1. **Start Your Development Server**

   ```bash
   npm run dev
   ```

2. **Test the Flow**

   - Go to your app
   - Click "Get Started" or "Sign In"
   - Try signing in with Google
   - Verify you can access protected pages
   - Test adding a glucose reading

3. **Check Database**
   - In Supabase dashboard, go to "Table Editor"
   - Check that user data is being created
   - Verify glucose logs are being saved

## 🔧 Advanced Configuration

### Custom Auth UI Styling

You can customize the Supabase Auth UI by modifying the theme in `src/pages/AuthPage.tsx`:

```typescript
<Auth
  supabaseClient={supabase}
  appearance={{
    theme: ThemeSupa,
    variables: {
      default: {
        colors: {
          brand: "#2563eb",
          brandAccent: "#1d4ed8",
          brandButtonText: "white",
          defaultButtonBackground: "#f3f4f6",
          defaultButtonBackgroundHover: "#e5e7eb",
          defaultButtonBorder: "#d1d5db",
          defaultButtonText: "#374151",
          dividerBackground: "#e5e7eb",
          inputBackground: "white",
          inputBorder: "#d1d5db",
          inputBorderHover: "#9ca3af",
          inputBorderFocus: "#2563eb",
          inputText: "#374151",
          inputLabelText: "#6b7280",
          inputPlaceholder: "#9ca3af",
          messageText: "#374151",
          messageTextDanger: "#dc2626",
          anchorTextColor: "#2563eb",
          anchorTextHoverColor: "#1d4ed8",
        },
        space: {
          inputPadding: "12px",
          buttonPadding: "12px 24px",
        },
        fontSizes: {
          baseBodySize: "14px",
          baseInputSize: "14px",
          baseLabelSize: "14px",
          baseButtonSize: "14px",
        },
        fonts: {
          bodyFontFamily: "Inter, system-ui, sans-serif",
          buttonFontFamily: "Inter, system-ui, sans-serif",
          inputFontFamily: "Inter, system-ui, sans-serif",
          labelFontFamily: "Inter, system-ui, sans-serif",
        },
        borderWidths: {
          buttonBorderWidth: "1px",
          inputBorderWidth: "1px",
        },
        radii: {
          borderRadiusButton: "8px",
          buttonBorderRadius: "8px",
          inputBorderRadius: "8px",
        },
      },
    },
  }}
  providers={["google"]}
  redirectTo={window.location.origin + "/dashboard"}
  showLinks={true}
  view="sign_in"
/>
```

### Email Templates (Optional)

1. **Go to Supabase Auth Settings**

   - Authentication → Email Templates
   - Customize confirmation, recovery, and change email templates

2. **Add Your Branding**
   - Include your logo
   - Use your brand colors
   - Add custom messaging

### Row Level Security (RLS) Explained

RLS ensures users can only access their own data:

```sql
-- This policy allows users to only see their own glucose logs
CREATE POLICY "Users can view their own glucose logs"
ON glucose_logs FOR SELECT
USING (auth.uid() = user_id);
```

- `auth.uid()` gets the current user's ID
- `user_id` is the column storing the user ID
- Users can only see records where they match

## 🚨 Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files to version control
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly

### 2. Database Security

- ✅ RLS is enabled on all tables
- ✅ Users can only access their own data
- ✅ Input validation on the frontend and backend

### 3. Authentication

- ✅ Use HTTPS in production
- ✅ Implement proper session management
- ✅ Regular security audits

### 4. API Security

- ✅ Rate limiting (Supabase handles this)
- ✅ Input sanitization
- ✅ CORS configuration

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid redirect URI" Error**

   - Check your Google OAuth redirect URIs
   - Ensure they match exactly (including http/https)
   - Add localhost for development

2. **"User not authenticated" Error**

   - Check your Supabase URL and anon key
   - Verify environment variables are set correctly
   - Check browser console for errors

3. **Database Connection Issues**

   - Verify your Supabase project is active
   - Check your database password
   - Ensure RLS policies are set up correctly

4. **Google OAuth Not Working**
   - Verify Google+ API is enabled
   - Check Client ID and Secret are correct
   - Ensure redirect URIs are properly configured

### Debug Steps

1. **Check Browser Console**

   - Look for JavaScript errors
   - Check network requests
   - Verify authentication state

2. **Check Supabase Logs**

   - Go to Supabase dashboard → Logs
   - Look for authentication events
   - Check for database errors

3. **Test Database Connection**
   ```sql
   -- Run this in Supabase SQL Editor
   SELECT * FROM auth.users LIMIT 1;
   ```

## 📞 Support Resources

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Google OAuth Docs**: [developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)
- **Supabase Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

## ✅ Checklist

- [ ] Supabase project created
- [ ] Database schema created
- [ ] RLS policies configured
- [ ] Google OAuth set up
- [ ] Environment variables configured
- [ ] Authentication tested
- [ ] Database connection verified
- [ ] Production URLs updated

Your authentication system is now ready! 🚀
