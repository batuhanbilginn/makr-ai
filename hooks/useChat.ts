import {
  addMessageAtom,
  currentChatAtom,
  currentChatHasMessagesAtom,
  messagesAtom,
} from "@/atoms/chat";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { ChatWithMessageCountAndSettings, MessageT } from "@/types/collections";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

const useChat = ({
  currentChat,
  initialMessages,
}: {
  currentChat: ChatWithMessageCountAndSettings;
  initialMessages: MessageT[];
}) => {
  const chatID = currentChat?.id;
  useHydrateAtoms([[currentChatAtom, currentChat] as const]);
  useHydrateAtoms([[messagesAtom, initialMessages] as const]);
  const { supabase } = useSupabase();
  const addMessageHandler = useSetAtom(addMessageAtom);
  const hasChatMessages = useAtomValue(currentChatHasMessagesAtom);
  const setMessages = useSetAtom(messagesAtom);
  const [currentChatState, setCurrentChat] = useAtom(currentChatAtom);

  // Set Initial Chat
  useEffect(() => {
    setCurrentChat(currentChat);
    setMessages(initialMessages);
  }, [currentChat, initialMessages, setCurrentChat, setMessages]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const writableParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );
  const isChatNew = writableParams.get("new") === "true";

  // Save Chat's Current Settings if it's a new chat
  const saveHandler = useCallback(async () => {
    await supabase
      .from("chats")
      .update({
        model: currentChatState?.model,
        system_prompt: currentChatState?.system_prompt,
      })
      .eq("id", currentChatState?.id);
  }, [currentChatState, supabase]);

  // Send First Message if it's a new chat
  useEffect(() => {
    if (isChatNew && chatID) {
      console.log('Running "isChatNew"');
      addMessageHandler("generate").then(async () => {
        writableParams.delete("new");
        router.replace(`/chat/${chatID}`);
      });
    }
  }, [
    addMessageHandler,
    chatID,
    isChatNew,
    router,
    saveHandler,
    writableParams,
  ]);

  return {
    hasChatMessages,
  };
};

export default useChat;
