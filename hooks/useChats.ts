import { chatsAtom, openAISettingsAtom } from "@/atoms/chat";
import { useAuth } from "@/lib/supabase/supabase-auth-provider";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { ChatWithMessageCountAndSettings } from "@/types/collections";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

const useChats = () => {
  // Auth & Supabase
  const { user } = useAuth();
  const { supabase } = useSupabase();

  // States
  const openAISettings = useAtomValue(openAISettingsAtom);
  const [chats, setChats] = useAtom(chatsAtom);

  const router = useRouter();

  const fetcher = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select(`*, messages(count)`)
      .eq("owner", user?.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map((chat) => {
      return {
        ...chat,
        advanced_settings: JSON.parse(chat.advanced_settings as string),
      };
    }) as ChatWithMessageCountAndSettings[];
  };

  const { data, error, isLoading, mutate } = useSWR(
    user ? ["chats", user.id] : null,
    fetcher
  );

  // Add New Chat Handler
  const addChatHandler = async () => {
    const { data: newChat, error } = await supabase
      .from("chats")
      .insert({
        owner: user?.id,
        model: openAISettings.model,
        system_prompt: openAISettings.system_prompt,
        advanced_settings: JSON.stringify(openAISettings.advanced_settings),
        history_type: openAISettings.history_type,
        title: "New Conversation",
      })
      .select(`*`)
      .returns<ChatWithMessageCountAndSettings[]>()
      .single();
    if (error && !newChat) {
      console.log(error);
      return;
    }

    // Add it to the top of the list
    mutate((prev: any) => {
      if (prev && prev.length > 0) {
        return [newChat, ...prev];
      } else {
        return [newChat];
      }
    });

    // Redirect to the new chat
    router.push(`/chat/${newChat.id}?new=true`);
  };

  // Set Chats
  useEffect(() => {
    setChats(data ?? []);
  }, [data, setChats]);

  return {
    chats,
    isLoading,
    error,
    mutate,
    addChatHandler,
  };
};

export default useChats;
