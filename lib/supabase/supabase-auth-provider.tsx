"use client";

import { ownerIDAtom } from "@/atoms/chat";
import { ProfileT } from "@/types/collections";
import { Session } from "@supabase/supabase-js";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import useSWR from "swr";
import { useSupabase } from "./supabase-provider";
interface ContextI {
  user: ProfileT | null | undefined;
  error: any;
  isLoading: boolean;
  mutate: any;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
}
const Context = createContext<ContextI>({
  user: null,
  error: null,
  isLoading: true,
  mutate: null,
  signOut: async () => {},
  signInWithGithub: async () => {},
});

export default function SupabaseAuthProvider({
  serverSession,
  children,
}: {
  serverSession?: Session | null;
  children: React.ReactNode;
}) {
  // THROW ERROR IF AUTH_REDIRECT IS NOT SET
  if (
    !process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL &&
    (process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
      process.env.NEXT_PUBLIC_VERCEL_ENV === "preview")
  ) {
    throw new Error("NEXT_PUBLIC_AUTH_REDIRECT_URL must be set in .env");
  }

  const { supabase } = useSupabase();
  const router = useRouter();
  const setOwnerID = useSetAtom(ownerIDAtom);

  // Get USER
  const getUser = async () => {
    const { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", serverSession?.user?.id)
      .single();
    if (error) {
      console.log(error);
      return null;
    } else {
      return user;
    }
  };

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(serverSession ? "profile-context" : null, getUser);

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    console.log("Signed Out! (from supabase-auth-provider.tsx)");
  };

  // Sign-In with Github
  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
          process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
            ? process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL
            : "http://localhost:3000/chat",
      },
    });
  };

  // Set Owner ID
  useEffect(() => {
    if (user) {
      setOwnerID(user.id);
    }
  }, [setOwnerID, user]);

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, serverSession?.access_token]);

  const exposed: ContextI = {
    user,
    error,
    isLoading,
    mutate,
    signOut,
    signInWithGithub,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
}

export const useAuth = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAuth must be used inside SupabaseAuthProvider");
  } else {
    return context;
  }
};
