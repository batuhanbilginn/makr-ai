"use client";
import { chatAtom, chatboxRefAtom } from "@/atoms/chat";
import { useAtomValue } from "jotai";
import ChatInput from "./chat-input";
import Message from "./message";

const Chatbox = () => {
  const messages = useAtomValue(chatAtom);
  const ref = useAtomValue(chatboxRefAtom);
  return (
    <div className="relative w-full h-screen bg-neutral-900">
      <div ref={ref} className="max-h-screen overflow-scroll">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default Chatbox;
