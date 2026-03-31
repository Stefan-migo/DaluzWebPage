"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database";

type Profile = Tables<"profiles">;

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

// Singleton client instance to avoid multiple GoTrueClient instances
let supabaseClientSingleton: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseClientSingleton) {
    supabaseClientSingleton = createClient();
  }
  return supabaseClientSingleton;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  });

  // Use ref to store the client instance
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  // Initialize client once
  if (!supabaseRef.current) {
    supabaseRef.current = getSupabaseClient();
  }

  const supabase = supabaseRef.current;

  useEffect(() => {
    let mounted = true;

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn("Auth initialization timed out, setting loading to false");
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    }, 10000); // 10 second timeout - increased for admin flows

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) return;
        clearTimeout(timeoutId);

        if (error) {
          console.error("Auth session error:", error);
          setAuthState((prev) => ({ ...prev, error, loading: false }));
          return;
        }

        if (session?.user) {
          // Set user immediately - don't wait for profile
          setAuthState({
            user: session.user,
            profile: null, // Will be loaded in background
            session,
            loading: false, // Set loading false immediately
            error: null,
          });

          // Fetch profile in background (non-blocking)
          fetchProfile(session.user.id)
            .then((profile) => {
              if (!mounted) return;
              setAuthState((prev) => ({
                ...prev,
                profile,
              }));
            })
            .catch((profileError) => {
              console.warn("Background profile fetch error:", profileError);
              // Don't update state on error - profile will be null
            });
        } else {
          setAuthState((prev) => ({ ...prev, loading: false }));
        }
      })
      .catch((sessionError) => {
        console.error("Session check error:", sessionError);
        if (mounted) {
          clearTimeout(timeoutId);
          setAuthState((prev) => ({
            ...prev,
            loading: false,
            error: sessionError,
          }));
        }
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session?.user) {
        // Set user immediately - don't wait for profile
        setAuthState({
          user: session.user,
          profile: null, // Will be loaded in background
          session,
          loading: false, // Set loading false immediately
          error: null,
        });

        // Fetch profile in background (non-blocking)
        fetchProfile(session.user.id)
          .then((profile) => {
            if (!mounted) return;
            setAuthState((prev) => ({
              ...prev,
              profile,
            }));
          })
          .catch((error) => {
            console.warn("Background profile fetch failed:", error);
            // Don't update state on error - profile will be null
          });
      } else if (event === "SIGNED_OUT") {
        setAuthState({
          user: null,
          profile: null,
          session: null,
          loading: false,
          error: null,
        });
      } else if (event === "TOKEN_REFRESHED" && session) {
        setAuthState((prev) => ({
          ...prev,
          session,
          user: session.user,
        }));
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (
    userId: string,
    retries = 1,
  ): Promise<Profile | null> => {
    const supabase = supabaseRef.current || getSupabaseClient();

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Reduced timeout to 5 seconds for faster login
        const profilePromise = supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        const timeoutPromise = new Promise(
          (_, reject) =>
            setTimeout(() => reject(new Error("Profile fetch timeout")), 5000), // 5 seconds
        );

        const { data, error } = (await Promise.race([
          profilePromise,
          timeoutPromise,
        ])) as any;

        if (error) {
          // Handle different error types more gracefully
          if (error.message === "Profile fetch timeout") {
            if (attempt < retries) {
              console.log(
                `⏱️ Profile fetch timed out, retrying... (${attempt + 1}/${retries})`,
              );
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * (attempt + 1)),
              ); // Exponential backoff
              continue;
            }
            console.warn(
              "⏱️ Profile fetch timed out after retries - this is normal for new users or slow connections",
            );
            return null;
          }

          if (error.code === "PGRST116") {
            // Profile doesn't exist - try to create it with basic info from auth user
            console.log(
              "📝 Profile not found - attempting to create basic profile",
            );
            try {
              const { data: authData } = await supabase.auth.getUser();
              if (authData?.user) {
                const { error: insertError } = await supabase
                  .from("profiles")
                  .insert({
                    id: userId,
                    email: authData.user.email || "",
                    first_name:
                      authData.user.user_metadata?.first_name ||
                      authData.user.user_metadata?.full_name?.split(" ")[0] ||
                      "",
                    last_name:
                      authData.user.user_metadata?.last_name ||
                      authData.user.user_metadata?.full_name
                        ?.split(" ")
                        .slice(1)
                        .join(" ") ||
                      "",
                    avatar_url:
                      authData.user.user_metadata?.avatar_url ||
                      authData.user.user_metadata?.picture ||
                      null,
                  });

                if (!insertError) {
                  // Retry fetch after creation
                  const { data: newProfile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", userId)
                    .single();

                  if (newProfile) {
                    console.log("✅ Profile created and loaded successfully");
                    return newProfile;
                  }
                }
              }
            } catch (createError) {
              console.warn("⚠️ Could not auto-create profile:", createError);
            }
            return null;
          }

          // Only log actual errors, not expected cases
          if (error.code !== "42P01") {
            // Table doesn't exist
            console.error("❌ Profile fetch error:", error);
          }
          return null;
        }

        if (data) {
          console.log("✅ Profile loaded successfully");
          return data;
        }
      } catch (error: any) {
        // More specific error handling
        if (error.message === "Profile fetch timeout") {
          if (attempt < retries) {
            console.log(
              `⏱️ Profile fetch timeout, retrying... (${attempt + 1}/${retries})`,
            );
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (attempt + 1)),
            );
            continue;
          }
          console.warn(
            "⏱️ Profile fetch timeout after retries - continuing without profile data",
          );
        } else {
          console.error("❌ Unexpected profile fetch error:", error);
        }
        if (attempt === retries) return null;
      }
    }

    return null;
  };

  const signUp = async (
    email: string,
    password: string,
    userData?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    },
  ) => {
    const supabase = supabaseRef.current || getSupabaseClient();
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData?.firstName,
            last_name: userData?.lastName,
          },
        },
      });

      if (authError) {
        setAuthState((prev) => ({ ...prev, error: authError, loading: false }));
        throw authError;
      }

      // If user was created, also create their profile
      if (authData.user && !authData.user.email_confirmed_at) {
        // Profile will be created via database trigger when user confirms email
        setAuthState((prev) => ({ ...prev, loading: false }));
        return { data: authData, error: null };
      }

      // If user is immediately confirmed, create profile now
      if (authData.user && authData.user.email_confirmed_at) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: authData.user.email!,
          first_name: userData?.firstName || "",
          last_name: userData?.lastName || "",
          phone: userData?.phone || "",
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Don't fail the signup for profile creation errors
        }
      }

      setAuthState((prev) => ({ ...prev, loading: false }));
      return { data: authData, error: null };
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, error: error, loading: false }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const supabase = supabaseRef.current || getSupabaseClient();
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthState((prev) => ({ ...prev, error, loading: false }));
        return { data: null, error };
      }

      // Don't set loading false here - let the auth state change handler do it
      // This prevents race conditions
      return { data, error: null };
    } catch (error: any) {
      console.error("SignIn error:", error);
      setAuthState((prev) => ({ ...prev, error, loading: false }));
      return { data: null, error };
    }
  };

  const signOut = async () => {
    const supabase = supabaseRef.current || getSupabaseClient();
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthState((prev) => ({ ...prev, error, loading: false }));
      return { error };
    }

    return { error: null };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const supabase = supabaseRef.current || getSupabaseClient();
    if (!authState.user) {
      throw new Error("No user logged in");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", authState.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update local state
    setAuthState((prev) => ({
      ...prev,
      profile: data,
    }));

    return data;
  };

  const resetPassword = async (email: string) => {
    const supabase = supabaseRef.current || getSupabaseClient();
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setAuthState((prev) => ({ ...prev, error, loading: false }));
        throw error;
      }

      setAuthState((prev) => ({ ...prev, loading: false }));
      return { error: null };
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, error, loading: false }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const supabase = supabaseRef.current || getSupabaseClient();
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setAuthState((prev) => ({ ...prev, error, loading: false }));
        throw error;
      }

      // The redirect will happen automatically, so we don't set loading to false here
      // The auth state change handler will handle the session update
      return { data, error: null };
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, error, loading: false }));
      throw error;
    }
  };

  const signUpWithGoogle = async () => {
    // For OAuth, sign up and sign in are the same - it creates an account if one doesn't exist
    return signInWithGoogle();
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    signInWithGoogle,
    signUpWithGoogle,
    refetchProfile: () =>
      authState.user ? fetchProfile(authState.user.id) : null,
  };
}
