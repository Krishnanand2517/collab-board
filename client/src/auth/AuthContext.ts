import type {
  AuthError,
  AuthResponse,
  OAuthResponse,
  PostgrestError,
  Session,
  User,
  UserResponse,
} from "@supabase/supabase-js";
import { createContext } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export type UpdateProfileResult = {
  data: UserProfile | null;
  error: PostgrestError | { message: string } | null;
};

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  signInWithProvider: (provider: "google" | "github") => Promise<OAuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<
    | {
        data: object;
        error: null;
      }
    | {
        data: null;
        error: AuthError;
      }
  >;
  updatePassword: (newPassword: string) => Promise<UserResponse>;
  verifyOtpSignup: (email: string, token: string) => Promise<AuthResponse>;
  verifyOtpReset: (email: string, token: string) => Promise<AuthResponse>;
  resendOtp: (email: string) => Promise<AuthResponse>;
  updateProfile: (
    updates: Partial<UserProfile>
  ) => Promise<UpdateProfileResult>;
  deleteUser: () => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
