"use client";
import useChat2 from "@/hooks/useChat2";
import { MessageT } from "@/types/collections";
import ChatInput from "./chat-input";
import Messages from "./messages";

const Chatbox = ({
  type,
  chatID,
  initialMessages,
}: {
  type: "NEW" | "EXISTING";
  chatID?: string;
  initialMessages?: MessageT[];
}) => {
  useChat2({ chatID: chatID ?? "", initialMessages: initialMessages ?? [] });
  return (
    <div className="relative w-full h-screen bg-neutral-900">
      {type === "EXISTING" ? <Messages /> : <div>Start New Chat</div>}
      <ChatInput type={type} />
    </div>
  );
};

export default Chatbox;
