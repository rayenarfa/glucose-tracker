# Deployment Guide for Glucose Tracker

Your Glucose Tracker app is now ready for deployment! Here are the step-by-step instructions for different hosting platforms.

## 📚 Setup Guides

Before deploying, make sure you have completed the backend setup:

- **[Supabase & Authentication Setup](./SUPABASE_SETUP.md)** - Complete guide for database and Google OAuth
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist for deployment
- **[SEO & App Icon Setup](./SEO_GUIDE.md)** - SEO optimization and favicon setup

## 🚀 Quick Deploy Options

### Option 1: Netlify (Recommended - Easiest)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Netlify**

   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click "Deploy site"

3. **Configure Environment Variables**

   - In Netlify dashboard → Site settings → Environment variables
   - Add these variables:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your_anon_key_here
     ```

4. **Update Supabase Settings**
   - Go to your Supabase project → Authentication → URL Configuration
   - Add your Netlify domain to "Site URL"
   - Update Google OAuth redirect URLs in Google Cloud Console

### Option 2: Vercel (Fast & Modern)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Follow the prompts**

   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `dist`

4. **Add Environment Variables**
   - In Vercel dashboard → Project settings → Environment Variables
   - Add the same variables as above

### Option 3: GitHub Pages (Free)

1. **Update vite.config.ts**

   ```typescript
   export default defineConfig({
     base: "/your-repo-name/", // Add this line
     // ... rest of config
   });
   ```

2. **Create GitHub Actions workflow**
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

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables

Make sure you have these in your hosting platform:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Supabase Configuration

- ✅ Database schema is set up
- ✅ RLS policies are configured
- ✅ Google OAuth is enabled
- ✅ Redirect URLs are updated

### 3. Google OAuth Setup

In Google Cloud Console, add these redirect URIs:

- `https://your-project.supabase.co/auth/v1/callback`
- `https://your-domain.com/auth/callback`

### 4. Test Your Build Locally

```bash
npm run build
npm run preview
```

## 🌐 Domain Configuration

### Custom Domain (Optional)

1. **Netlify**: Site settings → Domain management → Add custom domain
2. **Vercel**: Project settings → Domains → Add domain
3. **Update Supabase**: Add custom domain to Site URL and redirect URLs

## 📱 PWA Features (Future Enhancement)

To make your app installable as a PWA:

1. Add a `manifest.json` file
2. Configure service worker
3. Add app icons
4. Update meta tags

## 🔍 Post-Deployment

### 1. Test Everything

- ✅ Authentication works
- ✅ Can add glucose readings
- ✅ Charts display correctly
- ✅ Mobile navigation works
- ✅ All pages load properly

### 2. Performance Check

- ✅ Lighthouse score > 90
- ✅ Mobile responsive
- ✅ Fast loading times

### 3. Security

- ✅ HTTPS enabled
- ✅ Environment variables are secure
- ✅ No sensitive data in client code

## 🛠️ Troubleshooting

### Build Errors

- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for TypeScript errors

### Runtime Errors

- Verify environment variables
- Check Supabase connection
- Review browser console for errors

### Authentication Issues

- Verify redirect URLs
- Check Google OAuth configuration
- Ensure Supabase auth is properly set up

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Test locally with `npm run preview`
4. Check Supabase logs for backend issues

## 🎉 Success!

Once deployed, your Glucose Tracker will be available at:

- **Netlify**: `https://your-app-name.netlify.app`
- **Vercel**: `https://your-app-name.vercel.app`
- **GitHub Pages**: `https://username.github.io/repo-name`

Your app is now live and ready for users! 🚀
