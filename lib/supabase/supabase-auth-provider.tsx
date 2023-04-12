"use client";

import { ProfileT } from "@/types/collections";
import { Session } from "@supabase/supabase-js";
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
  const { supabase } = useSupabase();
  const router = useRouter();

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
    console.log(process.env.NEXT_PUBLIC_VERCEL_ENV);
    console.log(
      "Redirect to:" + process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? "https://ai.makr.dev/chat"
        : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
        ? "https://preview-ai.makr.dev/chat"
        : "http://localhost:3000/chat"
    );
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
            ? "https://ai.makr.dev/chat"
            : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
            ? "https://preview-ai.makr.dev/chat"
            : "http://localhost:3000/chat",
      },
    });
  };

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
