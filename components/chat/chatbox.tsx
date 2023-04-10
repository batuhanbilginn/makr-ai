"use client";
import { currentChatHasMessagesAtom } from "@/atoms/chat";
import useChat from "@/hooks/useChat";
import { ChatWithMessageCountAndSettings, MessageT } from "@/types/collections";
import { useAtomValue } from "jotai";
import MobileMenuButton from "../navigation/mobile-menu-button";
import ChatInput from "./chat-input";
import Messages from "./messages";
import NewChatCurrent from "./new-chat-current";

const Chatbox = ({
  currentChat,
  initialMessages,
}: {
  currentChat: ChatWithMessageCountAndSettings;
  initialMessages: MessageT[];
}) => {
  const hasChatMessages = useAtomValue(currentChatHasMessagesAtom);
  useChat({ currentChat, initialMessages });

  return (
    <main className="relative flex flex-col items-stretch flex-1 w-full h-full ml-0 overflow-hidden transition-all transition-width md:ml-64 dark:bg-neutral-900 bg-neutral-50">
      <div className="flex-1 overflow-hidden">
        <MobileMenuButton />
        {hasChatMessages ? <Messages /> : <NewChatCurrent />}
        <ChatInput />
      </div>
    </main>
  );
};

export default Chatbox;
