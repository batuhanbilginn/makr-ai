import {
  addMessageAtom,
  currentChatAtom,
  currentChatHasMessagesAtom,
  messagesAtom,
} from "@/atoms/chat";
import { ChatWithMessageCountAndSettings, MessageT } from "@/types/collections";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const useChat = ({
  currentChat,
  initialMessages,
}: {
  currentChat: ChatWithMessageCountAndSettings;
  initialMessages: MessageT[];
}) => {
  const chatID = currentChat?.id;
  const addMessageHandler = useSetAtom(addMessageAtom);
  const hasChatMessages = useAtomValue(currentChatHasMessagesAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChat = useSetAtom(currentChatAtom);

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

  // Send First Message if it's a new chat
  useEffect(() => {
    if (isChatNew && chatID) {
      addMessageHandler("generate").then(async () => {
        writableParams.delete("new");
        router.replace(`/chat/${chatID}`);
      });
    }
  }, [addMessageHandler, chatID, isChatNew, router, writableParams]);

  return {
    hasChatMessages,
  };
};

export default useChat;
