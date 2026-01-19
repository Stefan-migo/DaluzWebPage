-- Enhance handle_new_user function to better support Google OAuth
-- This migration updates the function to handle Google OAuth metadata
-- SAFE: Uses CREATE OR REPLACE (idempotent) and ON CONFLICT (prevents errors)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
  user_avatar_url TEXT;
  user_full_name TEXT;
BEGIN
  -- Get email (required field)
  user_email := COALESCE(NEW.email, '');
  
  -- Extract metadata from raw_user_meta_data
  -- Google OAuth provides: full_name, avatar_url (or picture), email
  -- Also check for first_name and last_name if available (for email/password signups)
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    ''
  );
  
  -- Extract first name: prefer explicit first_name, fallback to splitting full_name
  user_first_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
    -- Try to extract from full_name if available
    CASE 
      WHEN user_full_name != '' THEN 
        NULLIF(TRIM(SPLIT_PART(user_full_name, ' ', 1)), '')
      ELSE NULL
    END
  );
  
  -- Extract last name: prefer explicit last_name, fallback to splitting full_name
  user_last_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
    -- Try to extract from full_name if available (everything after first word)
    CASE 
      WHEN user_full_name != '' AND array_length(string_to_array(user_full_name, ' '), 1) > 1 THEN
        NULLIF(TRIM(array_to_string((string_to_array(user_full_name, ' '))[2:], ' ')), '')
      ELSE NULL
    END
  );
  
  -- Get avatar URL (Google uses 'picture' or 'avatar_url')
  user_avatar_url := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
    NULLIF(NEW.raw_user_meta_data->>'picture', ''),
    NULL
  );
  
  -- Insert or update profile
  -- ON CONFLICT ensures this works even if profile already exists (idempotent)
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name,
    avatar_url
  )
  VALUES (
    NEW.id,
    user_email,
    user_first_name,
    user_last_name,
    user_avatar_url
  )
  ON CONFLICT (id) DO UPDATE SET
    -- Only update email if it's not already set (preserve existing)
    email = COALESCE(NULLIF(EXCLUDED.email, ''), profiles.email),
    -- Only update names if they're not already set (preserve existing data)
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    -- Update avatar if provided (can be updated)
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    -- This ensures auth.users is still created even if profile creation fails
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Add comment to document the function
COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates or updates user profile when a new auth user is created. 
Supports both email/password signup and OAuth providers (Google, etc.).
Extracts user metadata from raw_user_meta_data including name, avatar, etc.';
