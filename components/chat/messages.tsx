"use client";

import { chatboxRefAtom, messagesAtom } from "@/atoms/chat";
import { useAtomValue } from "jotai";
import Message from "./message";
import { ChatWithMessageCountAndSettings, MessageT } from "@/types/collections";
import useChat from "@/hooks/useChat";

const Messages = () => {
  const containerRef = useAtomValue(chatboxRefAtom);
  const messages = useAtomValue(messagesAtom);

  return (
    <div ref={containerRef} className="h-full overflow-y-scroll">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Messages;
