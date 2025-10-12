import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import supabase from "../db/supabaseClient";
import {
  type UserProfile,
  type UpdateProfileResult,
  AuthContext,
} from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // get initial session
    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error("Error getting session:", error);
        } else {
          await updateAuthState(data.session);
        }
      } catch (error) {
        console.error("Error in init:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const updateAuthState = async (session: Session | null) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    };

    init();

    // listen for auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        await updateAuthState(session);
      }
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user profile:", error);
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signUp = async (name: string, email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
  };

  const signInWithProvider = async (provider: "google" | "github") => {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  };

  const updatePassword = async (newPassword: string) => {
    return await supabase.auth.updateUser({ password: newPassword });
  };

  const verifyOtpSignup = async (email: string, token: string) => {
    return await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });
  };

  const verifyOtpReset = async (email: string, token: string) => {
    return await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });
  };

  const resendOtp = async (email: string) => {
    return await supabase.auth.signInWithOtp({ email });
  };

  const updateProfile = async (
    updates: Partial<UserProfile>
  ): Promise<UpdateProfileResult> => {
    if (!user)
      return {
        data: null,
        error: { message: "No user found" },
      };

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (!error && data) {
      setUserProfile(data);
    }

    return { data, error };
  };

  const deleteUser = async () => {
    if (!user || !session)
      return { success: false, error: "No user session found" };

    const { data, error } = await supabase.functions.invoke("delete-account");

    if (error) {
      console.error("Error deleting account:", error);
      return { success: false, error: error?.message };
    }

    return {
      success: true,
      message: data?.message ?? "Account deleted successfully",
    };
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    verifyOtpSignup,
    verifyOtpReset,
    resendOtp,
    updateProfile,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
