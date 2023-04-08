"use client";
import { currentChatHasMessagesAtom } from "@/atoms/chat";
import { ChatWithMessageCountAndSettings, MessageT } from "@/types/collections";
import { useAtomValue } from "jotai";
import MobileMenuButton from "../navigation/mobile-menu-button";
import JotaiProvider from "../providers/jotai-provider";
import ChatInput from "./chat-input";
import Messages from "./messages";
import NewChat from "./new-chat";
import useChat from "@/hooks/useChat";

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
        {hasChatMessages ? <Messages /> : <NewChat />}
        <ChatInput />
      </div>
    </main>
  );
};

export default Chatbox;
