import { useAuth } from "@/lib/supabase/supabase-auth-provider";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import useSWR from "swr";

const useChats = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();

  const fetcher = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("owner", user?.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    user ? ["chats", user.id] : null,
    fetcher
  );

  // Add New Chat Handler
  const addChatHandler = async () => {
    const { error } = await supabase
      .from("chats")
      .insert({
        owner: user?.id,
      })
      .select("*")
      .single();
    if (error && !data) {
      console.log(error);
      return;
    }
    mutate((prev: any) => {
      if (prev && prev.length > 0) {
        return [data, ...prev];
      } else {
        return [data];
      }
    });
  };

  return {
    chats: data,
    isLoading,
    error,
    mutate,
    addChatHandler,
  };
};

export default useChats;
