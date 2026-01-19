# Google OAuth Setup Guide for DA LUZ CONSCIENTE

This guide will help you configure Google OAuth authentication in your Supabase project.

## Prerequisites

- A Supabase project (already set up)
- A Google Cloud Console account
- Access to your Supabase dashboard

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** > **Credentials**

### 1.2 Create OAuth 2.0 Client ID

1. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
2. If prompted, configure the OAuth consent screen first:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information:
     - **App name**: DA LUZ CONSCIENTE
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Click **Save and Continue**
   - Add scopes (optional): `email`, `profile`, `openid`
   - Add test users if in testing mode
   - Review and submit

3. Back in Credentials, create OAuth client ID:
   - **Application type**: Web application
   - **Name**: DA LUZ Web App (or any name you prefer)
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://your-production-domain.com
     https://your-project.supabase.co
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/auth/callback
     https://your-production-domain.com/auth/callback
     https://your-project.supabase.co/auth/v1/callback
     ```
   - Click **Create**

4. **IMPORTANT**: Copy the **Client ID** and **Client Secret** - you'll need these for Supabase

# ===== GoogleAuth =====

# Add your Google OAuth credentials to .env.local:
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
# GOOGLE_CLIENT_SECRET=your_google_client_secret_here

## Step 2: Configure Supabase

### 2.1 Enable Google Provider in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the list and click to enable it
5. Enter your Google OAuth credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
6. Click **Save**

### 2.2 Configure Redirect URLs

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `http://localhost:3000` (for development) or your production URL
   - **Redirect URLs**: Add these URLs:
     ```
     http://localhost:3000/auth/callback
     https://your-production-domain.com/auth/callback
     ```

## Step 3: Database Setup (Profile Creation)

When a user signs in with Google for the first time, you need to ensure their profile is created in the `profiles` table.

### Option A: Use Database Trigger (Recommended)

Create a database trigger that automatically creates a profile when a new user is created:

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Option B: Handle in Application Code

The `useAuth` hook already listens for `SIGNED_IN` events and will attempt to fetch/create the profile. However, you may want to add logic to create the profile if it doesn't exist when a Google user signs in.

## Step 4: Test the Integration

### 4.1 Local Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`
3. Click "Continuar con Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorizing, you'll be redirected back to your app

### 4.2 Verify Profile Creation

1. After successful login, check your Supabase dashboard:
   - Go to **Authentication** > **Users** - you should see the new user
   - Go to **Table Editor** > **profiles** - verify the profile was created

### 4.3 Check User Metadata

Google OAuth provides user information in `raw_user_meta_data`:
- `email`: User's email
- `full_name`: User's full name
- `avatar_url` or `picture`: User's profile picture
- `first_name`: First name (if available)
- `last_name`: Last name (if available)

## Step 5: Production Deployment

### 5.1 Update Environment Variables

Make sure your production environment has the correct Supabase URLs:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5.2 Update Google OAuth Settings

1. In Google Cloud Console, add your production domain to:
   - **Authorized JavaScript origins**
   - **Authorized redirect URIs**

2. In Supabase Dashboard, update:
   - **Site URL** to your production domain
   - **Redirect URLs** to include your production callback URL

## Troubleshooting

### Issue: "redirect_uri_mismatch" Error

**Solution**: Ensure the redirect URI in Google Cloud Console exactly matches:
- `http://localhost:3000/auth/callback` (development)
- `https://your-domain.com/auth/callback` (production)
- `https://your-project.supabase.co/auth/v1/callback` (Supabase callback)

### Issue: Profile Not Created After Google Sign In

**Solution**: 
1. Check if the database trigger is set up correctly
2. Verify the `profiles` table has the correct structure
3. Check Supabase logs for any errors

### Issue: "Access blocked: This app's request is invalid"

**Solution**: 
1. Make sure your OAuth consent screen is properly configured
2. If in testing mode, add the user's email to test users
3. Verify the OAuth client ID and secret are correct in Supabase

### Issue: User Can't Sign In After First Google Sign Up

**Solution**: 
1. Check if the user exists in `auth.users` table
2. Verify the profile was created in `profiles` table
3. Check browser console for any errors

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase OAuth Providers](https://supabase.com/docs/guides/auth/social-login/auth-google)

## Security Notes

1. **Never commit OAuth secrets** to version control
2. **Use environment variables** for all sensitive credentials
3. **Enable HTTPS** in production
4. **Regularly rotate** OAuth client secrets
5. **Monitor** OAuth usage in Google Cloud Console

## Next Steps

After setting up Google OAuth:

1. ✅ Test the login flow
2. ✅ Verify profile creation
3. ✅ Test the signup flow (same as login for OAuth)
4. ✅ Update user profile handling if needed
5. ✅ Add error handling for edge cases
6. ✅ Consider adding other OAuth providers (Facebook, GitHub, etc.)

---

**Note**: The implementation in the codebase is ready. You just need to complete the Supabase and Google Cloud Console configuration steps above.
