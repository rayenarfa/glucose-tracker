# Glucose Tracker

A modern, mobile-first diabetes management application built with React, TypeScript, and Supabase.

## Features

- 📱 **Mobile-First Design** - Optimized for mobile devices with touch-friendly interactions
- 📊 **Interactive Charts** - Trading app-like charts with touch interactions
- 🔐 **Secure Authentication** - Google OAuth integration with Supabase
- 📈 **Real-time Data** - Live glucose tracking and statistics
- 🎨 **Modern UI/UX** - Clean, professional design with smooth animations
- 📱 **Responsive Navigation** - Adaptive navigation for desktop and mobile
- 🔍 **SEO Optimized** - Comprehensive meta tags, structured data, and social media sharing
- 📱 **PWA Ready** - Progressive Web App with installable capabilities

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Real-time)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Query
- **Icons**: Lucide React
- **SEO**: React Helmet Async

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd glucose-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## SEO & App Icon Setup

Your app comes with comprehensive SEO optimization and a professional glucose meter icon. See [SEO_GUIDE.md](./SEO_GUIDE.md) for complete setup instructions.

### Quick SEO Setup:

1. **Generate favicon files** from the glucose meter SVG
2. **Update domain URLs** in meta tags
3. **Create social media images** for better sharing
4. **Test meta tags** with online validators

### SEO Features Included:

- ✅ Comprehensive meta tags (Open Graph, Twitter Cards)
- ✅ Structured data (JSON-LD)
- ✅ Web app manifest for PWA
- ✅ Robots.txt and sitemap.xml
- ✅ Dynamic SEO component for page-specific meta tags
- ✅ Security headers and performance optimizations

## Deployment

### Option 1: Netlify (Recommended)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Netlify**

   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Configure environment variables**
   In Netlify dashboard → Site settings → Environment variables:

   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Update Supabase Settings**
   - Go to your Supabase project → Authentication → URL Configuration
   - Add your Netlify domain to "Site URL"
   - Update Google OAuth redirect URLs in Google Cloud Console

### Option 2: Vercel

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Follow the prompts and add environment variables**

### Option 3: GitHub Pages

1. **Update vite.config.ts**

   ```typescript
   export default defineConfig({
     base: "/your-repo-name/",
     // ... rest of config
   });
   ```

2. **Add GitHub Actions workflow**
   Create `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: "18"
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Enable GitHub Pages**
   - Go to repository settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

## Supabase Setup

1. **Create a Supabase project**

   - Go to [supabase.com](https://supabase.com)
   - Create a new project

2. **Set up the database schema**
   Run this SQL in your Supabase SQL editor:

   ```sql
   -- Enable RLS
   ALTER TABLE glucose_logs ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can insert their own glucose logs" ON glucose_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can view their own glucose logs" ON glucose_logs FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can update their own glucose logs" ON glucose_logs FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete their own glucose logs" ON glucose_logs FOR DELETE USING (auth.uid() = user_id);

   -- Add missing columns if needed
   ALTER TABLE glucose_logs
   ADD COLUMN IF NOT EXISTS meal_type text,
   ADD COLUMN IF NOT EXISTS meal_time timestamp;
   ```

3. **Configure Google OAuth**
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Add your Google OAuth credentials
   - Add redirect URLs in Google Cloud Console:
     - `https://your-project.supabase.co/auth/v1/callback`
     - `https://your-domain.com/auth/callback`

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:check` - Build with TypeScript checking
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── main.tsx        # App entry point

public/
├── glucosemeter-svgrepo-com.svg  # App icon
├── site.webmanifest              # PWA manifest
├── robots.txt                    # SEO crawling rules
├── sitemap.xml                   # Site structure
└── _redirects                    # Netlify routing
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
