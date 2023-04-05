"use client";

import { chatAtom, chatboxRefAtom } from "@/atoms/chat";
import { useAtomValue } from "jotai";
import Message from "./message";

const Messages = () => {
  const containerRef = useAtomValue(chatboxRefAtom);
  const messages = useAtomValue(chatAtom);
  return (
    <div ref={containerRef} className="max-h-screen overflow-scroll">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Messages;
