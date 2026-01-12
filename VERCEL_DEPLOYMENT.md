# Vercel Deployment Guide for PixelPal

## Environment Variables Setup

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables for **Production**, **Preview**, and **Development**:

```
SUPABASE_URL=https://eipbkokogsncrkelpwkj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcGJrb2tvZ3NuY3JrZWxwd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMDIyNzcsImV4cCI6MjA4MzU3ODI3N30.6f72RJUDjxJN62CuLSmnlin9463QFEfHMq_JQmt2IMU
```

## Supabase Configuration

### 1. Update Site URL
In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: Set to your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
- For multiple environments, use your production URL

### 2. Add Redirect URLs
In Supabase Dashboard → Authentication → URL Configuration → Redirect URLs:

Add ALL of these URLs:
- `https://your-app.vercel.app` (your production URL)
- `https://your-app-*.vercel.app` (preview deployments)
- `http://localhost:8000` (local testing)
- `http://localhost:3000` (local testing alternative)
- `http://127.0.0.1:8000` (local testing)

### 3. Enable Google Provider
In Supabase Dashboard → Authentication → Providers:

- Enable **Google** provider
- Add your Google OAuth Client ID and Client Secret

## Google Cloud Console Setup

### 1. OAuth Consent Screen
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to **APIs & Services** → **OAuth consent screen**
- Configure consent screen with your app details

### 2. OAuth Credentials
- Go to **APIs & Services** → **Credentials**
- Create or edit **OAuth 2.0 Client ID**
- Add Authorized redirect URIs:
  ```
  https://eipbkokogsncrkelpwkj.supabase.co/auth/v1/callback
  ```

## Debugging OAuth Issues

### Check Browser Console
When you click "Sign in with Google" on your Vercel deployment, open the browser console (F12) and look for:

1. `[SupabaseClient]` log messages - these show the OAuth flow
2. Any error messages related to authentication
3. The redirect URL being used

### Common Issues and Fixes

#### Issue 1: Redirects to localhost
**Problem**: After Google sign-in, redirects to `localhost:3000`

**Fix**: Update Supabase Site URL to your Vercel URL (not localhost)

#### Issue 2: "Redirect URI mismatch" error
**Problem**: Google shows an error about redirect URI

**Fix**: Ensure the Supabase callback URL is added to Google Cloud Console authorized redirect URIs:
- `https://eipbkokogsncrkelpwkj.supabase.co/auth/v1/callback`

#### Issue 3: Environment variables not loaded
**Problem**: Console shows using fallback/hardcoded values

**Fix**:
1. Ensure environment variables are set in Vercel
2. Redeploy the application
3. Check that variables are available in all environments (Production, Preview, Development)

#### Issue 4: OAuth works locally but not on Vercel
**Problem**: Google sign-in works on localhost but fails on Vercel

**Fix**:
1. Verify Vercel deployment URL is added to Supabase Redirect URLs
2. Verify Google OAuth credentials include the Supabase callback URL
3. Clear browser cache and cookies for your Vercel domain
4. Try in incognito/private browsing mode

## Testing the Deployment

### 1. Check Environment Variables
Open browser console on your Vercel deployment and check for:
```
[SupabaseClient] URL: https://eipbkokogsncrkelpwkj.supabase.co
[SupabaseClient] Current origin: https://your-app.vercel.app
```

If you see the correct origin (your Vercel URL), environment is set up correctly.

### 2. Test OAuth Flow
1. Click "Sign in with Google"
2. Check console for: `[SupabaseClient] Starting Google OAuth...`
3. Check console for: `[SupabaseClient] Redirect URL: https://your-app.vercel.app`
4. After Google authentication, you should be redirected back to your app
5. Check console for: `[SupabaseClient] Auth state changed: SIGNED_IN`

### 3. Test Offline Mode
Click "Play Offline" to verify the game works without authentication.

## Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase Site URL updated to Vercel URL
- [ ] All redirect URLs added in Supabase
- [ ] Google OAuth callback URL configured
- [ ] Deployed to Vercel
- [ ] Tested OAuth flow in production
- [ ] Tested offline mode
- [ ] Checked browser console for errors

## Need Help?

If you're still experiencing issues:

1. Share the browser console output (especially `[SupabaseClient]` logs)
2. Confirm your Vercel deployment URL
3. Verify Supabase dashboard settings match this guide
4. Try the OAuth flow in incognito mode to rule out browser cache issues
