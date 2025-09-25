import type {
  AuthResponse,
  PostgrestError,
  Session,
  User,
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
  signOut: () => Promise<void>;
  updateProfile: (
    updates: Partial<UserProfile>
  ) => Promise<UpdateProfileResult>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
