# Supabase Configuration Checklist

Use this checklist to verify your Supabase settings are correct for Vercel deployment.

## Step 1: Get Your Vercel URL

After deploying to Vercel, copy your deployment URL. It should look like:
- `https://virtual-pet-yourusername.vercel.app`
- Or `https://your-custom-domain.com`

**Your Vercel URL**: ________________________________

## Step 2: Update Supabase Dashboard

Go to: https://app.supabase.com/project/eipbkokogsncrkelpwkj/auth/url-configuration

### Site URL
- [ ] Set to your Vercel URL (e.g., `https://virtual-pet-yourusername.vercel.app`)
- [ ] No trailing slash
- [ ] Uses `https://` (not `http://`)

### Redirect URLs
Add each of these URLs (click "+ Add URL" for each):
- [ ] `https://virtual-pet-yourusername.vercel.app` (your production URL)
- [ ] `https://virtual-pet-yourusername-*.vercel.app` (for preview deployments)
- [ ] `http://localhost:8000` (for local testing)

## Step 3: Verify Google Provider

Go to: https://app.supabase.com/project/eipbkokogsncrkelpwkj/auth/providers

- [ ] Google provider is **enabled**
- [ ] Client ID is filled in
- [ ] Client Secret is filled in

## Step 4: Verify Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

Find your OAuth 2.0 Client ID and verify:

### Authorized redirect URIs includes:
- [ ] `https://eipbkokogsncrkelpwkj.supabase.co/auth/v1/callback`

**Important**: This must be the Supabase callback URL, NOT your Vercel URL!

## Step 5: Test on Vercel

Visit your Vercel deployment and:

1. Open browser console (F12)
2. Look for these log messages:
   - [ ] `[SupabaseClient] Initializing...`
   - [ ] `[SupabaseClient] URL: https://eipbkokogsncrkelpwkj.supabase.co`
   - [ ] `[SupabaseClient] Current origin:` shows your Vercel URL

3. Click "Sign in with Google"
   - [ ] Console shows: `[SupabaseClient] Starting Google OAuth...`
   - [ ] Console shows: `[SupabaseClient] Redirect URL:` with your Vercel URL
   - [ ] Google login page opens
   - [ ] After selecting Google account, you're redirected back to your app
   - [ ] Console shows: `[SupabaseClient] Auth state changed: SIGNED_IN`
   - [ ] Console shows: `[SupabaseClient] User signed in:` with your email

## Common Mistakes

❌ **Site URL still set to localhost:3000**
- This causes redirects back to localhost after Google login

❌ **Missing Vercel URL in Redirect URLs**
- Supabase will reject the redirect

❌ **Wrong callback URL in Google Cloud Console**
- Should be `https://eipbkokogsncrkelpwkj.supabase.co/auth/v1/callback`
- NOT your Vercel URL

❌ **Environment variables not set in Vercel**
- Go to Vercel project → Settings → Environment Variables
- Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`

## Still Having Issues?

If OAuth still doesn't work after completing this checklist:

1. Clear your browser cache and cookies
2. Try in incognito/private browsing mode
3. Check browser console for error messages
4. Share the console output showing the `[SupabaseClient]` logs
