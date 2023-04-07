"use client";

import { chatboxRefAtom, messagesAtom } from "@/atoms/chat";
import { useAtomValue } from "jotai";
import Message from "./message";

const Messages = () => {
  const containerRef = useAtomValue(chatboxRefAtom);
  const messages = useAtomValue(messagesAtom);
  return (
    <div ref={containerRef} className="h-full max-h-screen overflow-scroll">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Messages;
